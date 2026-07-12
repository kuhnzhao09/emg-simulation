# emg-simulation

一个完全离线、零依赖、单文件运行的表面肌电（sEMG）仿真网页。模型以运动单位放电为核心，依据 Fuglevand 的运动单位募集与放电率编码框架，以及 Farina/Merletti 的 MUAP、体积传导和电极空间滤波思想，模拟单肌等长收缩条件下的表面肌电生成过程。

## 快速使用

1. 下载仓库中的 `index.html`。
2. 双击文件，在现代浏览器中直接打开。
3. 选择“教学预设”或“科研预设”。
4. 调整参数并点击“运行仿真”。
5. 可导出参数 JSON、时序 CSV 和运动单位 Ground Truth JSON。

无需服务器、无需安装依赖、无需联网。

## 模型流程

```text
兴奋驱动 E(t)
→ 运动单位募集
→ 放电率编码与随机 ISI
→ 运动单位动作电位 MUAP
→ 多运动单位卷积叠加
→ 单极/双极电极检测
→ 滤波 sEMG、整流包络与肌力
```

## 主要功能

- 阶跃、斜坡和梯形兴奋输入；
- 指数分布运动单位募集阈值；
- 放电率编码与 ISI 随机变异；
- 固定随机种子，保证结果可复现；
- 参数化 MUAP，并考虑传导速度、肌纤维长度、神经支配带、电极间距和等效深度；
- 单极、双极和滤波 sEMG；
- 肌电包络和运动单位 twitch 力叠加；
- 兴奋驱动、募集数量、放电栅格、MUAP、sEMG、包络和肌力可视化；
- 参数、时序数据和完整运动单位 Ground Truth 导出。

## 两种预设

### 教学预设

使用较少运动单位和较低计算量，便于观察募集、放电、MUAP 叠加和包络变化。

### 科研预设

使用较高采样率、较多运动单位和多通道设置，适合生成可复现的算法测试数据。

## 导出文件

- `emg_parameters.json`：当前仿真参数；
- `emg_timeseries.csv`：时间、兴奋驱动、募集数量、原始/双极/滤波 sEMG、包络和肌力；
- `emg_ground_truth.json`：每个运动单位的募集阈值、放电率、深度、twitch 参数、MUAP 参数和放电时间。

## 模型范围

当前版本用于基础教学和算法原型验证，采用单肌、等长收缩和简化体积传导近似。不包含：

- 个体化 MRI/超声体积导体；
- 动态关节运动和肌肉—皮肤相对滑移；
- 卒中、ALS、脊髓损伤等病理模型；
- 疲劳、温度和代谢引起的传导速度变化；
- 有限元求解。

## 本地验证

需要 Node.js 和 Python，均不需要额外安装包：

```bash
node tests/core.test.js
node tests/ui-smoke.test.js
python tests/static_check.py
```

测试内容包括随机种子复现性、募集阈值单调性、兴奋输入范围、数组尺寸、数值有限性、包络非负性、募集数量随兴奋增强而增加，以及离线资源完整性。

## 理论依据

- Fuglevand AJ, Winter DA, Patla AE. Models of recruitment and rate coding organization in motor-unit pools. *Journal of Neurophysiology*. 1993;70(6):2470–2488.
- Farina D, Mesin L, Martina S, Merletti R. A surface EMG generation model with multilayer cylindrical description of the volume conductor. *IEEE Transactions on Biomedical Engineering*. 2004;51(3):415–426.
- Merletti R, Farina D, editors. *Surface Electromyography: Physiology, Engineering, and Applications*. Wiley-IEEE Press; 2016.

更详细的公式与实现假设见 [`docs/model-design.md`](docs/model-design.md)。

## 免责声明

本项目不用于临床诊断或治疗决策。仿真参数为一般性示例，输出不能替代真实神经生理测量。

## License

MIT License。
