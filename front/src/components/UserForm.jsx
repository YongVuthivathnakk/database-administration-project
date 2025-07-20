import { useState } from "react"
import { useNavigate } from "react-router-dom";


function UserForm() {
    const availablePrivileges = ["SELECT", "INSERT", "DELETE", "CREATE", "DROP"];
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
        name: "",
        host: "localhost",
        password: "",
        privileges: []
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }


    const handlePrivilegeChange = (e) => {
        const { value, checked } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            privileges: checked
                ? [...prevForm.privileges, value]
                : prevForm.privileges.filter((g) => g !== value),
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        const payload = {
            name: form.name,
            host: form.host,
            password: form.password,
            privileges: form.privileges,
        };

        try {
            const res = await fetch("http://localhost:4000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Create Failed");
            setMessage({ type: "success", text: data.message || "User is created successfully" });
            navigate("/users");
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
        >
            <h2>Create User</h2>
            <label className="flex flex-col gap-10" htmlFor="beekeeper-name">Name:
                <input
                    id="beekeeper-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </label>
            <label className="flex flex-col gap-10" htmlFor="beekeeper-name">Password:
                <input
                    id="beekeeper-name"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </label>


            <fieldset className="my-4">
                <legend className="font-medium mb-2">Grant Access:</legend>
                {availablePrivileges.map((privilege) => (
                    <label
                        key={privilege}
                        className="flex items-center space-x-2 mb-2 text-sm text-gray-700"
                    >
                        <input
                            type="checkbox"
                            value={privilege}
                            checked={form.privileges.includes(privilege)}
                            onChange={handlePrivilegeChange}
                            className="text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span>{privilege}</span>
                    </label>
                ))}
            </fieldset>

            {message && (
                <div
                    className={`my-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <button className="main" type="submit">
                Create User
            </button>
            {/* {onCancel && ( */}
            <button type="button" onClick={() => { }} style={{ marginLeft: '1rem' }}>
                Cancel
            </button>
            {/* )} */}
            <span className="bee-sticker" role="img" aria-label="bee">
                🐝
                <span className="bee-heart">💛</span>
            </span>
        </form>
    )
}

export default UserForm