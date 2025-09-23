import { Link } from "components/documentation";

const QAS = [
  {
    question:
      "Q1. 什么是简历生成器？为什么简历生成器比简历模板文档更好？",
    answer: (
      <>
        <p>
          如今创建简历有两种方式。一种选择是使用简历模板，比如Office/Google文档，并根据您的需要进行自定义。另一种选择是使用简历生成器，这是一个在线工具，允许您输入信息并自动为您生成简历。
        </p>
        <p>
          使用简历模板需要手动格式化工作，比如复制和粘贴文本段落以及调整间距，这可能耗时且容易出错。很容易遇到格式问题，比如复制粘贴后使用不同的项目符号或字体样式。另一方面，像OpenResume这样的简历生成器通过自动格式化简历来节省时间并防止格式错误。它还提供了通过简单点击轻松更改字体类型或大小的便利。总之，简历生成器比简历模板更易于使用。
        </p>
      </>
    ),
  },
  {
    question:
      "Q2. OpenResume与其他简历生成器和模板的独特之处是什么？",
    answer: (
      <>
        <p>
          除了OpenResume之外，还有一些很棒的免费简历生成器，例如{" "}
          <Link href="https://rxresu.me/">Reactive Resume</Link>、{" "}
          <Link href="https://flowcv.com/">FlowCV</Link>。但是，OpenResume具有2个独特的功能：
        </p>{" "}
        <p>
          <span className="font-semibold">
            1. OpenResume专为美国就业市场和最佳实践设计。
          </span>
          <br />
          与其他针对全球受众并提供许多自定义选项的简历生成器不同，OpenResume有意只提供符合美国最佳实践的选项。例如，它排除了添加个人照片的选项，以避免偏见和歧视。它只提供核心部分，例如个人简介、工作经验、教育和技能，同时省略不必要的部分，如推荐人。此外，OpenResume只提供自上而下的单列简历设计，而不是两列设计，因为单列设计最适合ATS。<br />{" "}
        </p>
        <p>
          <span className="font-semibold">
            2. OpenResume非常注重隐私保护。
          </span>{" "}
          <br />
          虽然其他简历生成器可能需要邮箱注册并将用户数据存储在其数据库中，但OpenResume认为简历数据应该保持私密，只能在用户的本地机器上访问。因此，OpenResume不需要注册即可使用应用程序，所有输入的数据都存储在用户的浏览器中，只有用户才能访问。
        </p>
      </>
    ),
  },
  {
    question: "Q3. 谁创建了OpenResume，为什么要创建它？",
    answer: (
      <>
        <p>
          OpenResume是由{" "}
          <Link href="https://github.com/xitanggg">Xitang Zhao</Link>创建的，并由{" "}
          <Link href="https://www.linkedin.com/in/imzhi">Zhigang Wen</Link>设计，作为一个周末项目。作为美国的移民，我们在创建第一份简历和申请实习及工作时犯了很多错误。我们花了很长时间才学会一些最佳实践。在指导第一代学生并审查他们的简历时，我们注意到学生们犯了和我们以前一样的错误。这让我们思考如何利用我们获得的知识和技能来帮助他们。我们开始在周末聊天和工作，最终创建了OpenResume，我们将最佳实践和知识整合到这个简历生成器中。我们希望OpenResume能够帮助任何人轻松创建遵循最佳实践的现代专业简历，让任何人都能自信地申请工作。
        </p>
        <p>
          汉化的工作由 <Link href="https://plantree.me">Plantree</Link> 完成，并增加了 PWA 支持，以及 YAML 格式的导入/导出。
        </p>
      </>
    ),
  },
  {
    question: "Q4. 我如何支持OpenResume？",
    answer: (
      <>
        <p>
          支持OpenResume的最佳方式是与我们分享您的想法和反馈，以帮助进一步改进它。您可以通过{" "}
          <Link href="mailto:hello@open-resume.com">hello@open-resume.com</Link>{" "}
          给我们发邮件，或者在我们的Github仓库{" "}
          <Link href="https://github.com/xitanggg/open-resume/issues/new">
            创建一个问题
          </Link>
          。无论您喜欢还是不喜欢，我们都很乐意听到您的意见。
        </p>
        <p>
          支持OpenResume的另一种好方法是传播这个消息。与您的朋友、在社交媒体平台上或与您学校的就业中心分享它。我们的目标是接触更多在创建简历方面有困难的人，您的口碑支持将非常感谢。如果您使用Github，您还可以{" "}
          <Link href="https://github.com/xitanggg/open-resume">
            给项目一个星标
          </Link>{" "}
          来表示支持，帮助增加其知名度和影响力。
        </p>
      </>
    ),
  },
];

export const QuestionsAndAnswers = () => {
  return (
    <section className="mx-auto max-w-3xl divide-y divide-gray-300 lg:mt-4 lg:px-2">
      <h2 className="text-center text-3xl font-bold">问题与答案</h2>
      <div className="mt-6 divide-y divide-gray-300">
        {QAS.map(({ question, answer }) => (
          <div key={question} className="py-6">
            <h3 className="font-semibold leading-7">{question}</h3>
            <div className="mt-3 grid gap-2 leading-7 text-gray-600">
              {answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};