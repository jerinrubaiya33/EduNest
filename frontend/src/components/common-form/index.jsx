import { Button } from "../ui/AnimatedButton";
import FormControls from "./form-controlls";

function CommonForm({
    handleSubmit,
    buttonText = "Submit",
    formControls = [],
    formData,
    setFormData,
    className = "",
}) {

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
            
            {/* Render dynamic controls */}
            <FormControls
                formControls={formControls}
                formData={formData}
                setFormData={setFormData}
            />

            <Button type="submit">
                {buttonText}
            </Button>
        </form>
    );
}

export default CommonForm;
