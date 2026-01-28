import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { currentUser, currentUserData, setCurrentUserData } = useAuth();

  const [form, setForm] = useState({
    ownerName: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    if (currentUserData?.profile) {
      setForm(currentUserData.profile);
    }
  }, [currentUserData]);

  const save = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      profile: form,
    });

    setCurrentUserData((p) => ({
      ...p,
      profile: form,
    }));

    alert("Profile saved");
  };

  return (
    <div>
      <h2>My Profile</h2>

      <input
        placeholder="Owner Name"
        value={form.ownerName}
        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        placeholder="City"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />

      <button onClick={save}>Save Profile</button>
    </div>
  );
}
