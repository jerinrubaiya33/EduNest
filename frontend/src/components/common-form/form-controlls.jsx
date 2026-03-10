import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControls = [], formData, setFormData }) {

    function renderComponentByType(controlItem) {

        switch (controlItem.commonType) {

            case "input":
                return (
                    <Input
                        id={controlItem.name}
                        name={controlItem.name}
                        placeholder={controlItem.placeholder}
                        type={controlItem.type || "text"}
                        value={formData[controlItem.name] || ""}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                [controlItem.name]: e.target.value
                            }))
                        }
                    />
                );

            case "select":
                return (
                    <Select
                        value={formData[controlItem.name] || ""}
                        onValueChange={(value) =>
                            setFormData(prev => ({
                                ...prev,
                                [controlItem.name]: value
                            }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={controlItem.label} />
                        </SelectTrigger>

                        <SelectContent>
                            {controlItem.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case "textarea":
                return (
                    <Textarea
                        id={controlItem.name}
                        name={controlItem.name}
                        placeholder={controlItem.placeholder}
                        value={formData[controlItem.name] || ""}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                [controlItem.name]: e.target.value
                            }))
                        }
                    />
                );
 
            default:
                return <Input
                    id={controlItem.name}
                    name={controlItem.name}
                    placeholder={controlItem.placeholder}
                    type={controlItem.type}
                />;
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {formControls.map(controlItem => (
                <div key={controlItem.name}>
                    <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
                    {renderComponentByType(controlItem)}
                </div>
            ))}
        </div>
    );
}

export default FormControls;
