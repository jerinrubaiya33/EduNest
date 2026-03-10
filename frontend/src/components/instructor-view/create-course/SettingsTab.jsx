// SettingsTab.jsx
import { useContext, useState } from "react";
import { InstructorContext } from "@/context/instructor-context";

export default function SettingsTab() {
  const { 
    courseSettingsFormData, 
    setCourseSettingsFormData,
  } = useContext(InstructorContext);

  // Track if user has interacted with settings
  const [userHasInteracted, setUserHasInteracted] = useState({
    pricing: false,
    isPublished: false,
  });

  // Handle settings changes
  const handleSettingsChange = (field, value) => {
    setCourseSettingsFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Mark this field as interacted by user
    if (field === 'pricing' || field === 'isPublished') {
      setUserHasInteracted(prev => ({ ...prev, [field]: true }));
    }
  };

  // Check if settings are actually completed by user
  const isSettingsActuallyComplete = () => {
    const pricingValid = userHasInteracted.pricing && courseSettingsFormData.pricing !== undefined;
    const publicationValid = userHasInteracted.isPublished && courseSettingsFormData.isPublished !== undefined;
    return pricingValid && publicationValid;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Course Settings</h3>

      {/* Completion Status */}
      <div className={`mb-4 p-3 rounded-none ${isSettingsActuallyComplete() ? 'bg-[#eff6ff] border border-[#184EF0]/25' : 'bg-[#f8faff] border border-[#184EF0]/25'}`}>
        <p className={`text-sm font-medium ${isSettingsActuallyComplete() ? 'text-[#184EF0]' : 'text-[#184EF0]'}`}>
          {isSettingsActuallyComplete() ? '✓ Settings Complete' : '⚠️ Complete all required settings below'}
        </p>
      </div>

      {/* Pricing Section */}
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">
          Course Pricing (USD) {!userHasInteracted.pricing && <span className="text-[#184EF0]">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={courseSettingsFormData.pricing || 0}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
              handleSettingsChange("pricing", value);
            }}
            className={`w-full border rounded-none px-4 py-2 focus:outline-none focus:ring-1 ${userHasInteracted.pricing ? 'border-[#184EF0]/25 focus:ring-[#184EF0]/20 focus:border-[#184EF0]' : 'border-[#184EF0]/25 focus:ring-[#184EF0]/20 focus:border-[#184EF0]'}`}
            placeholder="0.00"
          />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500">
            Set to 0 for a free course
          </p>
          {!userHasInteracted.pricing && (
            <p className="text-sm text-[#184EF0]">
              Please set a price (0 for free)
            </p>
          )}
        </div>
      </div>

      {/* Publication Status */}
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">
          Publication Status {!userHasInteracted.isPublished && <span className="text-[#184EF0]">*</span>}
        </label>
        <div className={`p-3 border rounded-none ${!userHasInteracted.isPublished ? 'border-[#184EF0]/25 bg-[#f8faff]' : 'border-[#184EF0]/25'}`}>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="publishStatus"
                checked={courseSettingsFormData.isPublished === true}
                onChange={() => handleSettingsChange("isPublished", true)}
                className="mr-2"
              />
              <span>Publish Now</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="publishStatus"
                checked={courseSettingsFormData.isPublished === false}
                onChange={() => handleSettingsChange("isPublished", false)}
                className="mr-2"
              />
              <span>Save as Draft</span>
            </label>
          </div>
          {!userHasInteracted.isPublished && (
            <p className="text-sm text-[#184EF0] mt-2">
              Please select publication status
            </p>
          )}
        </div>
      </div>

      {/* Additional Settings (Optional) */}
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">
          Course Access (Optional)
        </label>
        <select
          value={courseSettingsFormData.accessType || "lifetime"}
          onChange={(e) => handleSettingsChange("accessType", e.target.value)}
          className="w-full border border-[#184EF0]/25 rounded-none px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#184EF0]/20 focus:border-[#184EF0]"
        >
          <option value="lifetime">Lifetime Access</option>
          <option value="subscription">Subscription Based</option>
          <option value="timed">Time Limited Access</option>
        </select>
      </div>

      {/* Certificate Settings (Optional) */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={courseSettingsFormData.hasCertificate || false}
            onChange={(e) => handleSettingsChange("hasCertificate", e.target.checked)}
            className="mr-2"
          />
          <span>Include Certificate of Completion (Optional)</span>
        </label>
      </div>

      {/* Requirements (Optional) */}
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">
          Course Requirements (Optional)
        </label>
        <textarea
          value={courseSettingsFormData.requirements || ""}
          onChange={(e) => handleSettingsChange("requirements", e.target.value)}
          className="w-full border border-[#184EF0]/25 rounded-none px-4 py-2 h-24 focus:outline-none focus:ring-1 focus:ring-[#184EF0]/20 focus:border-[#184EF0]"
          placeholder="List any prerequisites or requirements for this course..."
        />
      </div>
    </div>
  );
}
