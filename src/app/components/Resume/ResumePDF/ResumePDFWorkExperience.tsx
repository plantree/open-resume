import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
  sectionMarginTop,
  sectionGap,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
  sectionMarginTop?: string;
  sectionGap?: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading} sectionMarginTop={sectionMarginTop} sectionGap={sectionGap}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        // Hide company name if it is the same as the previous company
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
            {!hideCompanyName && (
              <ResumePDFText bold={true}>{company}</ResumePDFText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: hideCompanyName
                  ? "-" + spacing["1"]
                  : spacing["1.5"],
              }}
            >
              <ResumePDFText>{jobTitle}</ResumePDFText>
              <ResumePDFText>{date}</ResumePDFText>
            </View>
            {descriptions.some((d) => d.trim()) && (
              <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                <ResumePDFBulletList items={descriptions} />
              </View>
            )}
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
