import { View, Image } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, email, phone, url, summary, location, photoUrl } = profile;
  const iconProps = { location, email, phone, url };

  const PhotoComponent = photoUrl ? (
    isPDF ? (
      <Image
        src={photoUrl}
        style={{
          width: "56pt",
          height: "56pt",
          borderRadius: "28pt",
          objectFit: "cover" as any,
        }}
      />
    ) : (
      <img
        src={photoUrl}
        alt=""
        style={{
          width: "56pt",
          height: "56pt",
          borderRadius: "28pt",
          objectFit: "cover",
        }}
      />
    )
  ) : null;

  return (
    <ResumePDFSection style={{ marginTop: spacing["4"] }}>
      <View style={{ ...styles.flexRow, alignItems: "center", gap: spacing["3"] }}>
        {PhotoComponent}
        <View style={{ ...styles.flexCol, flex: 1 }}>
          <ResumePDFText
            bold={true}
            themeColor={themeColor}
            style={{ fontSize: "20pt" }}
          >
            {name}
          </ResumePDFText>
          {summary && (
            <ResumePDFText style={{ marginTop: spacing["1"] }}>
              {summary}
            </ResumePDFText>
          )}
        </View>
      </View>
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: "wrap",
          marginTop: spacing["0.5"],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) {
              iconType = "url_github";
            } else if (value.includes("linkedin")) {
              iconType = "url_linkedin";
            }
          }

          const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`;
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`; // Keep only + and digits
                break;
              }
              default: {
                src = value.startsWith("http") ? value : `https://${value}`;
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
              }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <Wrapper>
                <ResumePDFText>{value}</ResumePDFText>
              </Wrapper>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
