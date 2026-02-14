import { Page, View, Document } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  // === Auto-fit to one page ===
  const fontSizePt = parseFloat(fontSize) || 11;
  const lineHeight = fontSizePt * 1.3;
  const nameFontSizePt = 20;
  const nameLineHeight = nameFontSizePt * 1.3;
  const pageHeight = documentSize === "A4" ? 841.89 : 792;
  const pageWidth = documentSize === "A4" ? 595.28 : 612;
  const bulletIndent = 18; // bullet paddingL(6) + paddingR(6) + char width(~6)

  // Estimate wrapped text height for a string at a given available width
  const estimateTextH = (text: string, availableWidth: number): number => {
    if (!text) return 0;
    let w = 0;
    for (const ch of text) {
      w += ch.charCodeAt(0) > 0x2e80 ? fontSizePt : fontSizePt * 0.55;
    }
    return Math.max(1, Math.ceil(w / availableWidth)) * lineHeight;
  };

  // Compute total content height given spacing parameters (all in pt).
  // This accounts for section gaps between flex children, entry margins,
  // and all internal spacing within each component.
  const computeHeight = (
    hPad: number,
    secMargin: number,
    secGap: number,
    profMargin: number
  ): number => {
    const tw = pageWidth - hPad * 2;
    const dw = tw - bulletIndent;
    let h = 0;

    // Top color bar
    if (settings.themeColor) h += 10.5;

    // --- Profile section ---
    h += profMargin;
    const profSectionGap = 6; // profile section gap is always spacing["2"]
    // Name + Photo row (flexRow, height = max of photo vs name column)
    const summaryH = profile.summary
      ? 3 + estimateTextH(profile.summary, tw - (profile.photoUrl ? 65 : 0))
      : 0;
    const nameColH = nameLineHeight + summaryH;
    h += Math.max(profile.photoUrl ? 56 : 0, nameColH);
    // Gap + contact icons row
    h += profSectionGap + 1.5; // section gap + marginTop spacing["0.5"]
    const contactCount = [
      profile.location,
      profile.email,
      profile.phone,
      profile.url,
    ].filter(Boolean).length;
    h += contactCount > 3 ? lineHeight * 2 : lineHeight;

    // --- Content sections ---
    for (const form of showFormsOrder) {
      h += secMargin; // section marginTop
      h += lineHeight; // heading text

      switch (form) {
        case "workExperiences": {
          workExperiences.forEach((we, idx) => {
            h += secGap; // flex gap between children (heading→entry, entry→entry)
            if (idx > 0) h += 6; // marginTop on non-first entries
            h += lineHeight; // company name
            h += 4.5 + lineHeight; // spacing["1.5"] + job title/date row
            h += 4.5; // spacing["1.5"] before descriptions
            we.descriptions.forEach((d) => {
              h += estimateTextH(d, dw);
            });
          });
          break;
        }
        case "educations": {
          educations.forEach((edu) => {
            h += secGap;
            h += lineHeight; // school
            h += 4.5 + lineHeight; // spacing["1.5"] + degree/date row
            const descs = edu.descriptions || [];
            if (descs.join("")) {
              h += 4.5;
              descs.forEach((d) => {
                h += estimateTextH(d, dw);
              });
            }
          });
          break;
        }
        case "projects": {
          projects.forEach((proj) => {
            h += secGap;
            h += 1.5 + lineHeight; // spacing["0.5"] + title/date row
            h += 1.5; // spacing["0.5"] before descriptions
            proj.descriptions.forEach((d) => {
              h += estimateTextH(d, dw);
            });
          });
          break;
        }
        case "skills": {
          const featuredCount = skills.featuredSkills.filter(
            (s) => s.skill
          ).length;
          if (featuredCount > 0) {
            h += secGap;
            h += 1.5; // marginTop spacing["0.5"]
            h += Math.ceil(featuredCount / 3) * (lineHeight + 4);
          }
          if (skills.descriptions.length > 0) {
            h += secGap;
            skills.descriptions.forEach((d) => {
              h += estimateTextH(d, dw);
            });
          }
          break;
        }
        case "custom": {
          h += secGap;
          custom.descriptions.forEach((d) => {
            h += estimateTextH(d, dw);
          });
          break;
        }
      }
    }

    return h;
  };

  // Compression tiers from loosest to tightest
  const tiers = [
    { pad: 60, margin: 15, gap: 6, profM: 12 },
    { pad: 50, margin: 12, gap: 5, profM: 9 },
    { pad: 42, margin: 9, gap: 4, profM: 6 },
    { pad: 36, margin: 6, gap: 3, profM: 3 },
    { pad: 30, margin: 4, gap: 1.5, profM: 1.5 },
  ];

  // Reserve bottom gap so content doesn't touch the page edge
  const bottomMargin = 20; // ~7mm bottom gap
  const targetHeight = pageHeight - bottomMargin;

  // Pick the loosest tier where estimated content fits
  let selectedTier = tiers[tiers.length - 1];
  for (const tier of tiers) {
    const est = computeHeight(tier.pad, tier.margin, tier.gap, tier.profM);
    if (est * 1.05 <= targetHeight) {
      selectedTier = tier;
      break;
    }
  }

  const horizontalPadding = selectedTier.pad + "pt";
  const sectionMarginTop = selectedTier.margin + "pt";
  const sectionGap = selectedTier.gap + "pt";
  const profileMarginTop = selectedTier.profM + "pt";

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
        sectionMarginTop={sectionMarginTop}
        sectionGap={sectionGap}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]}
        sectionMarginTop={sectionMarginTop}
        sectionGap={sectionGap}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor}
        sectionMarginTop={sectionMarginTop}
        sectionGap={sectionGap}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["skills"]}
        sectionMarginTop={sectionMarginTop}
        sectionGap={sectionGap}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
        sectionMarginTop={sectionMarginTop}
        sectionGap={sectionGap}
      />
    ),
  };

  return (
    <>
      <Document title={`${name} Resume`} author={name} producer={"OpenResume"}>
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            ...styles.flexCol,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
          }}
        >
          {Boolean(settings.themeColor) && (
            <View
              style={{
                width: spacing["full"],
                height: spacing[3.5],
                backgroundColor: themeColor,
              }}
            />
          )}
          <View
            style={{
              ...styles.flexCol,
              padding: `${spacing[0]} ${horizontalPadding}`,
              paddingBottom: "20pt",
            }}
          >
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
              style={{ marginTop: profileMarginTop }}
            />
            {showFormsOrder.map((form) => {
              const Component = formTypeToComponent[form];
              return <Component key={form} />;
            })}
          </View>
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
