import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import "./style.css";

const LoginRegister = ({onLogin}) => {
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [error, setError] = useState("");
    const [showLogin, setShowLogin] = useState(true);
    const history = useHistory();

    const clearForm = () => {
        setLoginName("");
        setPassword("");;
        setConfirmPassword("");
        setLocation("");
        setDescription("");
        setFirstName("");
        setLastName("");
        setOccupation("");
        setError("");
    };

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch("/admin/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({login_name: loginName, password})
            });
            if (response.ok){
                const user = await response.json();
                onLogin(user);
                history.push("/");
            }else{
                const err = await response.json();
                setError(err.message);
            }
        } catch (error){
            console.error("Error logging in: ", error);
            setError("Internal server error");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword){
            setError("Password do not match");
            return;
        }
        try{
            const response = await fetch("/user", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    login_name: loginName,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    location,
                    description,
                    occupation
                })
            });
            if (response.ok){
                setError("Registration successful. Please login.");
                clearForm();
                setShowLogin(true);
            } else {
                const err = await response.json();
                setError(err.message);
            }
        } catch (error){
            console.error("Error registering: ", error);
            setError("Internal server error during registration.")
        }
    };

    return (
        <div className="login-register">
            {showLogin ? (
                <>
                    <form onSubmit={handleLogin} className="form">
                        <label>
                            Login Name:
                            <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Login Name" required />
                        </label>
                        <label>
                            Password: 
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                    <button onClick={() => { clearForm(); setShowLogin(false); }} style={{ marginLeft: '200px' }}>Register</button>
                </>
            ) : (
                <>
                    <form onSubmit={handleRegister} className="form">
                        <label>
                            Login Name:
                            <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Login Name" required />
                        </label>
                        <label>
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                        </label>
                        <label>
                            Confirm Password:
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
                        </label>
                        <label>
                            First Name:
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                        </label>
                        <label>
                            Location:
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                        </label>
                        <label>
                            Description:
                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                        </label>
                        <label>
                            Occupation:
                            <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Occupation" />
                        </label>
                        <button type="submit">Register</button>
                    </form>
                    <button onClick={() => { clearForm(); setShowLogin(true); }} style={{ marginLeft: '200px' }} >Login</button>
                </>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default LoginRegister;