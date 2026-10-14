import {useState} from 'react';
import SessionDetails from './components/SessionDetails.jsx';
import SessionPreview from './components/SessionPreview.jsx';
import WindowHeader from './components/WindowHeader.jsx';
import {useDesktopWindow} from './hooks/useDesktopWindow.js';
import {usePostureSession} from './hooks/usePostureSession.js';
import './mascot.css';
import './posture.css';

export default function App() {
  const desktopWindow = useDesktopWindow();
  const session = usePostureSession(desktopWindow.visibleRef);
  const [showCamera, setShowCamera] = useState(true);
  const {expanded, windowVisible, toggleExpanded, close} = desktopWindow;

  return (
    <div
      className={`shell ${expanded ? 'expanded' : 'compact'}`}
      data-observed-at={session.lastObservation.current}
    >
      <WindowHeader
        expanded={expanded}
        running={session.running}
        selected={session.selected}
        onToggleExpanded={toggleExpanded}
        onClose={close}
      />
      <SessionPreview
        session={session}
        expanded={expanded}
        showCamera={showCamera}
        windowVisible={windowVisible}
      />
      {expanded && (
        <SessionDetails
          session={session}
          showCamera={showCamera}
          onShowCameraChange={setShowCamera}
        />
      )}
      {!expanded && session.message && (
        <p className="compact-message" role="status">{session.message}</p>
      )}
    </div>
  );
}
