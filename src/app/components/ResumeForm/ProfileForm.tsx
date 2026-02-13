import { useRef } from "react";
import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, summary, location, photoUrl } = profile;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小不能超过 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      dispatch(changeProfile({ field: "photoUrl", value: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    dispatch(changeProfile({ field: "photoUrl", value: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-full flex items-center gap-4">
          <div className="flex-shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="头像"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-700">头像</label>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoUrl ? "更换头像" : "上传头像"}
              </button>
              {photoUrl && (
                <button
                  type="button"
                  className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleRemovePhoto}
                >
                  删除
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <p className="text-xs text-gray-400">支持 JPG/PNG，不超过 2MB</p>
          </div>
        </div>
        <Input
          label="姓名"
          labelClassName="col-span-full"
          name="name"
          placeholder="萨尔·汗"
          value={name}
          onChange={handleProfileChange}
        />
        <Textarea
          label="求职目标"
          labelClassName="col-span-full"
          name="summary"
          placeholder="致力于让教育对任何人都免费的企业家和教育工作者"
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label="邮箱"
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="电话"
          labelClassName="col-span-2"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label="网站"
          labelClassName="col-span-4"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label="地址"
          labelClassName="col-span-2"
          name="location"
          placeholder="北京, 中国"
          value={location}
          onChange={handleProfileChange}
        />
      </div>
    </BaseForm>
  );
};
