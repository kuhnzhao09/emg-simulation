from pathlib import Path

p = Path('index.html')
assert p.exists(), 'index.html missing'
text = p.read_text(encoding='utf-8')
assert text.count('<style>') == 1, 'embedded style missing'
assert '<script id="app-script">' in text, 'app script missing'
for bad in ['http://', 'https://', '<script src=', '<link rel="stylesheet"', 'import ']:
    assert bad not in text, f'external dependency detected: {bad}'
required_ids = [
    'duration','sampleRate','excitationType','maxExcitation','motorUnitCount','thresholdRange',
    'lastRecruitmentThreshold','minFiringRate','maxFiringRate','isiCv','seed',
    'conductionVelocity','fiberLength','innervationZone','electrodeSpacing','depthAttenuation',
    'channelCount','snrDb','mainsEnabled','mainsFrequency','envelopeCutoff',
    'runBtn','resetBtn','teachingPresetBtn','researchPresetBtn','randomSeedBtn',
    'exportParamsBtn','exportSeriesBtn','exportGroundTruthBtn',
    'excitationCanvas','recruitmentCanvas','rasterCanvas','muapCanvas','rawCanvas',
    'filteredCanvas','envelopeCanvas','forceCanvas','comparisonCanvas'
]
for rid in required_ids:
    assert f'id="{rid}"' in text, f'missing id {rid}'
for label in ['运动单位募集与放电','MUAP 与 sEMG 生成','结果分析与数据导出','运行仿真','教学预设','科研预设']:
    assert label in text, f'missing label {label}'
assert 'window.EMGSimulatorCore' in text, 'core export missing'
assert 'UTF-8' in text and 'BOM' in text, 'CSV BOM documentation missing'
print('static checks passed')
