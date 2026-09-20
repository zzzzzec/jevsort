# JevSort

> O(n log n) comparisons, O(log n) vibes.

一个故意不讲武德的排序实验：让 TypeSafe Jev 对最多 20 个整数进行排序。

- **串行选最大**：每轮调用一次 Jev，从剩余候选中选出最大值。
- **并行猜第 k 大**：一次请求同时询问第 1 到第 n 大，观察独立问题是否产生重复或冲突。
- **严格输入**：仅接受 -1,000,000 到 1,000,000 之间的整数。
- **访客自带 Key**：API Key 只存在页面内存，并由同源 Pages Function 临时转发；项目不会保存或记录 Key。

## Cloudflare Pages

将仓库连接到 Cloudflare Pages，构建配置如下：

- Framework preset: `None`
- Build command: 留空
- Build output directory: `.`

Pages 会自动识别 `functions/api/jev.js`，网页默认通过 `/api/jev` 调用它。

本地联调可使用：

```bash
npx wrangler pages dev .
```

然后打开终端显示的本地地址。直接双击 `index.html` 只能查看界面，无法运行 Pages Function。
