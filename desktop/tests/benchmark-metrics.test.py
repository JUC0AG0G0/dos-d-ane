import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('metrics',Path(__file__).resolve().parents[1]/'scripts'/'summarize-posture-benchmark.py')
metrics=importlib.util.module_from_spec(spec);spec.loader.exec_module(metrics)
class MetricsTests(unittest.TestCase):
    def test_abstentions_are_not_correct_or_silently_dropped(self):
        rows=[]
        for model in ['mediapipe','movenet','yolo']:
            rows.extend([{'model':model,'label':'01_good','error':'no detection'},
                         {'model':model,'label':'02_slouch','backend':'test','measurements':[{'totalMs':10,'poseMs':7}],
                          'assessment':{'state':'bad','regions':dict.fromkeys(['head','neck','shoulders','torso'],'unknown'),'measurementCoverage':{'neckForward':False}}}])
        for result in metrics.summarize({'results':rows}).values():
            self.assertEqual(result['agreementAll'],.5)
            self.assertEqual(result['agreementDecided'],1)
            self.assertEqual(result['coverageBinary'],.5)
            self.assertEqual(result['falseAlertRate'],0)
            self.assertEqual(result['sensitivityAll'],1)
            self.assertEqual(result['confusion']['01_good']['unknown'],1)
    def test_wilson_interval_has_nonzero_uncertainty_at_extremes(self):
        self.assertGreater(metrics.wilson(0,30)[1],0)
        self.assertLess(metrics.wilson(30,30)[0],1)
if __name__=='__main__':unittest.main()
