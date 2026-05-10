import { useState, useCallback } from "react";
import { isValidURL } from "../components/lectureComponents/utils/validators";
// import { isValidURL } from "../utils/validators";

const initialState = {
  topic: "",
  link: "",
  date: "",
  className: "",
};

export default function useLectureForm(onSubmit) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  // input change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const formatURL = (url) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
};


  // submit handler
 const handleSubmit = useCallback(
  (e) => {
    e.preventDefault();

    let formattedLink = formatURL(form.link);

    if (!isValidURL(formattedLink)) {
      setError("Invalid YouTube / Drive link");
      return;
    }

    setError("");
    onSubmit({
      ...form,
      link: formattedLink, // ✅ fixed link
    });

    setForm(initialState);
  },
  [form, onSubmit]
);


  return {
    form,
    error,
    handleChange,
    handleSubmit,
  };
}
