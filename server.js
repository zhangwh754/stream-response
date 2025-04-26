const Koa = require("koa");
const cors = require("@koa/cors");
const serve = require("koa-static");
const path = require("path");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(serve(path.join(__dirname)));

router.get("/events", async (ctx) => {
  ctx.status = 200; // 添加状态码
  ctx.set({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const article = [
    "人工智能（AI）正在深刻改变我们的生活方式。\n\n",
    "从语音助手到自动驾驶，AI技术已经渗透到我们日常生活的方方面面。在医疗领域，AI可以帮助医生更准确地诊断疾病；在教育领域，AI可以为学生提供个性化的学习体验。\n\n",
    "然而，AI的发展也带来了一些挑战。我们需要认真思考如何确保AI的安全性和伦理性，如何保护个人隐私，以及如何处理AI可能带来的就业变革。\n\n",
    "展望未来，AI技术将继续快速发展，为人类社会带来更多可能性。重要的是，我们要以负责任的态度推动AI的发展，确保这项技术真正造福人类。",
  ];

  const stream = ctx.res;
  let currentPart = 0;

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (currentPart < article.length) {
        const message = {
          time: new Date().toISOString(),
          message: article[currentPart],
          isEnd: currentPart === article.length - 1,
        };
        stream.write(`${JSON.stringify(message)}\n`);
        currentPart++;
      } else {
        clearInterval(timer);
        stream.end();
        resolve();
      }
    }, 3000);
  });
});

app.use(router.routes()).use(router.allowedMethods());

const port = 3001;
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
