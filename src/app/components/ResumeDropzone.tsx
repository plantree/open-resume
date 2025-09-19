import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { parseResumeFromYaml } from "lib/yaml-utils";
import {
  getHasUsedAppBefore,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { type ShowForm, initialSettings } from "lib/redux/settingsSlice";
import { useRouter } from "next/navigation";
import addPdfSrc from "public/assets/add-pdf.svg";
import Image from "next/image";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
  type: "",
};

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
  playgroundView = false,
}: {
  onFileUrlChange: (fileUrl: string) => void;
  className?: string;
  playgroundView?: boolean;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasInvalidFile, setHasInvalidFile] = useState(false);
  const [fileError, setFileError] = useState("");
  const router = useRouter();

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size, type } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl, type });
    onFileUrlChange(fileUrl);
  };

  const isValidFileType = (fileName: string): boolean => {
    return fileName.endsWith(".pdf") || fileName.endsWith(".yaml") || fileName.endsWith(".yml");
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (isValidFileType(newFile.name)) {
      setHasInvalidFile(false);
      setFileError("");
      setNewFile(newFile);
    } else {
      setHasInvalidFile(true);
      setFileError("仅支持PDF和YAML文件(.pdf, .yaml, .yml)");
    }
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFile = files[0];
    if (isValidFileType(newFile.name)) {
      setHasInvalidFile(false);
      setFileError("");
      setNewFile(newFile);
    } else {
      setHasInvalidFile(true);
      setFileError("仅支持PDF和YAML文件(.pdf, .yaml, .yml)");
    }
  };

  const onRemove = () => {
    setFile(defaultFileState);
    onFileUrlChange("");
  };

  const onImportClick = async () => {
    try {
      let resume;
      let settings = deepClone(initialSettings);

      if (file.name.endsWith(".pdf")) {
        // 处理PDF文件
        resume = await parseResumeFromPdf(file.fileUrl);
      } else if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
        // 处理YAML文件
        const response = await fetch(file.fileUrl);
        const yamlContent = await response.text();
        const result = parseResumeFromYaml(yamlContent);
        resume = result.resume;
        
        // 如果YAML包含设置信息，使用它
        if (result.settings) {
          settings = result.settings;
        }
      } else {
        throw new Error("不支持的文件格式");
      }

      // Set formToShow settings based on uploaded resume if users have used the app before
      if (getHasUsedAppBefore()) {
        const sections = Object.keys(settings.formToShow) as ShowForm[];
        const sectionToFormToShow: Record<ShowForm, boolean> = {
          workExperiences: resume.workExperiences.length > 0,
          educations: resume.educations.length > 0,
          projects: resume.projects.length > 0,
          skills: resume.skills.descriptions.length > 0,
          custom: resume.custom.descriptions.length > 0,
        };
        for (const section of sections) {
          settings.formToShow[section] = sectionToFormToShow[section];
        }
      }

      saveStateToLocalStorage({ resume, settings });
      router.push("/resume-builder");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "文件导入失败";
      setFileError(errorMessage);
      setHasInvalidFile(true);
    }
  };

  return (
    <div
      className={cx(
        "flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 ",
        isHoveredOnDropzone && "border-sky-400",
        playgroundView ? "pb-6 pt-4" : "py-12",
        className
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={() => setIsHoveredOnDropzone(false)}
      onDrop={onDrop}
    >
      <div
        className={cx(
          "text-center",
          playgroundView ? "space-y-2" : "space-y-3"
        )}
      >
        {!playgroundView && (
          <Image
            src={addPdfSrc}
            className="mx-auto h-14 w-14"
            alt="Add pdf"
            aria-hidden="true"
            priority
          />
        )}
        {!hasFile ? (
          <>
            <p
              className={cx(
                "pt-3 text-gray-700",
                !playgroundView && "text-lg font-semibold"
              )}
            >
              浏览文件或将其拖放到此处
            </p>
            <p className="flex text-sm text-gray-500">
              <LockClosedIcon className="mr-1 mt-1 h-3 w-3 text-gray-400" />
              文件数据仅在本地使用，不会离开您的浏览器
            </p>
            <p className="text-xs text-gray-400 mt-1">
              支持PDF和YAML格式 (.pdf, .yaml, .yml)
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="pl-7 font-semibold text-gray-900">
              {file.name} - {getFileSizeString(file.size)}
            </div>
            <button
              type="button"
              className="outline-theme-blue rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              title="Remove file"
              onClick={onRemove}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        )}
        <div className="pt-4">
          {!hasFile ? (
            <>
              <label
                className={cx(
                  "within-outline-theme-purple cursor-pointer rounded-full px-6 pb-2.5 pt-2 font-semibold shadow-sm",
                  playgroundView ? "border" : "bg-primary"
                )}
              >
                浏览文件
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.yaml,.yml"
                  onChange={onInputChange}
                />
              </label>
              {hasInvalidFile && (
                <p className="mt-6 text-red-400">{fileError}</p>
              )}
            </>
          ) : (
            <>
              {!playgroundView && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={onImportClick}
                >
                  导入并继续 <span aria-hidden="true">→</span>
                </button>
              )}
              <p className={cx(" text-gray-500", !playgroundView && "mt-6")}>
                注意：{!playgroundView ? "导入" : "解析器"}在单列简历上效果最佳
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toPrecision(3) + " KB";
  } else {
    return fileSizeMB.toPrecision(3) + " MB";
  }
};
