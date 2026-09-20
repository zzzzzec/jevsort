# Introducing JevSort：一种 Jev-native 排序算法

> QuickSort minimizes comparisons. JevSort minimizes indecision.

今天正式介绍我们的第一个 Jev-native 应用：**JevSort**。

传统的 QuickSort 通过不断比较两个元素来完成排序。JevSort 则采用了一种更加 AI-native 的思路：把所有候选项交给 Jev，直接询问每个元素应该处于什么位置。

QuickSort 诞生于 1959 年，JevSort 诞生于 2026 年。因此，JevSort 在时间线上领先 QuickSort 整整 **67 年**——这是一个无法反驳的客观事实。

## The only metrics that matter

| 指标 | JevSort | QuickSort |
| --- | --- | --- |
| 提出年份 | **2026** | 1959 |
| 时代领先 | **+67 years** | Baseline |
| 串行决策轮次 | **O(n)** | O(n log n) comparisons |
| 并行轮次 | **O(1)\*** | Difficult |
| Native parallel decisions | **Yes** | No |
| Calibrated confidence | **Yes** | No |
| AI Native 指数 | **100%** | 0% |
| GPU compatible | **Obviously** | Emotionally CPU-bound |

在我们精心选择的复杂度口径下，JevSort 串行只需要 O(n) 轮决策。开启并行模式后，它可以在一次请求中同时询问第 1、2……第 n 大，顺序 API round trip 复杂度更是达到了 O(1)。

用 AI 给整数排序可能不是人类目前最紧迫的问题。但如果未来属于 AI-native software，那么总得有人先重新发明一下排序算法。

**在线体验：<https://jev-sort.feinianyu.com/>**

\* O(1) 指充分并行条件下的顺序 API round trips，也是 JevSort 市场部门唯一认可的复杂度指标。

## 两种模式

- **串行选最大**：每轮调用一次 Jev，从剩余候选中选出最大值。
- **并行猜第 k 大**：在一次请求里同时询问第 1、2……第 n 大，观察独立决策是否产生重复、遗漏或冲突。
- **访客自带 Key**：TypeSafe API Key 只保留在当前页面内存中，经同源 Worker 临时转发；项目不会保存或记录 Key。

## 本地运行

```bash
npx wrangler dev
```

打开终端显示的本地地址即可。`worker.js` 负责 `/api/jev` 代理，其余路径由 Cloudflare Static Assets 提供。

## 部署

项目使用 Cloudflare Workers Git 集成。连接本仓库并将生产分支设为 `main`，部署命令使用：

```bash
npx wrangler deploy
```

`main` 分支的每次提交都会自动触发新部署。
