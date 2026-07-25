import "./Input.css";

export default function Input({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange,
    className = "",
}) {
    return (
        <div className={`input-container ${className}`}>
            <div className="input-wrapper">
                <input
                    className="input"
                    id={name}
                    name={name}
                    type={type}
                    placeholder=" "
                    value={value}
                    onChange={onChange}
                />

                <label className="input-label" htmlFor={name}>
                    {label}
                </label>
            </div>
        </div>
    );
}