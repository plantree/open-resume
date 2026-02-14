import { useState } from "react";
import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const showDelete = workExperiences.length > 1;

  // Track which entries have descriptions expanded.
  // Initialize: show descriptions if the entry already has non-empty descriptions.
  const [showDescriptions, setShowDescriptions] = useState<
    Record<number, boolean>
  >(() => {
    const init: Record<number, boolean> = {};
    workExperiences.forEach((we, idx) => {
      init[idx] = we.descriptions.some((d) => d.trim() !== "");
    });
    return init;
  });

  const toggleDescriptions = (idx: number) => {
    setShowDescriptions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <Form form="workExperiences" addButtonText="添加工作">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          // TS doesn't support passing union type to single call signature
          // https://github.com/microsoft/TypeScript/issues/54027
          // any is used here as a workaround
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        const hasDescriptions = showDescriptions[idx] ?? descriptions.some((d) => d.trim() !== "");

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="删除工作"
          >
            <Input
              label="公司"
              labelClassName="col-span-full"
              name="company"
              placeholder="可汗学院"
              value={company}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="职位"
              labelClassName="col-span-4"
              name="jobTitle"
              placeholder="软件工程师"
              value={jobTitle}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="日期"
              labelClassName="col-span-2"
              name="date"
              placeholder="2022年6月 - 至今"
              value={date}
              onChange={handleWorkExperienceChange}
            />
            {hasDescriptions ? (
              <BulletListTextarea
                label="描述"
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="要点描述"
                value={descriptions}
                onChange={handleWorkExperienceChange}
              />
            ) : (
              <div className="col-span-full flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleDescriptions(idx)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <span>+ 添加描述</span>
                </button>
              </div>
            )}
          </FormSection>
        );
      })}
    </Form>
  );
};
