"""Faux backend HTTP local pour tester l'envoi des mesures."""

from __future__ import annotations

import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest


class FakeApi:
    def __init__(self) -> None:
        self.received: list[dict] = []
        self.headers: list[dict] = []
        self.status = 201
        self._server = HTTPServer(("127.0.0.1", 0), self._handler())
        self.url = f"http://127.0.0.1:{self._server.server_port}/api"
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)

    def _handler(self):
        api = self

        class Handler(BaseHTTPRequestHandler):
            def do_POST(self):  # noqa: N802
                body = self.rfile.read(int(self.headers["Content-Length"]))
                if api.status < 300:
                    api.received.append(json.loads(body))
                    api.headers.append(dict(self.headers))
                self.send_response(api.status)
                self.end_headers()

            def log_message(self, *args):
                pass

        return Handler

    def __enter__(self) -> FakeApi:
        self._thread.start()
        return self

    def __exit__(self, *exc) -> None:
        self._server.shutdown()
        self._server.server_close()


@pytest.fixture
def fake_api():
    with FakeApi() as api:
        yield api
