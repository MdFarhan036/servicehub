import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  // HERO
  hero_title: "",
  hero_subtitle: "",
  hero_image: null,

  // INTRO
  intro_title: "",
  intro_para1: "",
  intro_para2: "",
  intro_image: null,

  // STATS
  stat1_number: "",
  stat1_text: "",

  stat2_number: "",
  stat2_text: "",

  stat3_number: "",
  stat3_text: "",

  stat4_number: "",
  stat4_text: "",

  // MISSION / VISION
  mission: "",
  vision: "",

  // VALUES
  value1_title: "",
  value1_desc: "",

  value2_title: "",
  value2_desc: "",

  value3_title: "",
  value3_desc: "",

  value4_title: "",
  value4_desc: "",

  // CTA
  cta_title: "",
  cta_subtitle: "",
  cta_button_text: "",

  // SEO
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  seo_schema: ""
};

export default function AboutForm() {
  const [form, setForm] =
    useState(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res =
        await api.get(
          "/admin/about"
        );

      setForm({
        ...emptyForm,
        ...res.data,
        hero_image: null,
        intro_image: null
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  };

  const handleFile = (
    name,
    file
  ) => {
    setForm({
      ...form,
      [name]: file
    });
  };

const save = async () => {
  try {
    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      if (
        key !== "hero_image" &&
        key !== "intro_image"
      ) {
        fd.append(
          key,
          form[key] || ""
        );
      }
    });

    if (
      form.hero_image &&
      form.hero_image instanceof File
    ) {
      fd.append(
        "hero_image",
        form.hero_image
      );
    }

    if (
      form.intro_image &&
      form.intro_image instanceof File
    ) {
      fd.append(
        "intro_image",
        form.intro_image
      );
    }

    await api.put(
      "/admin/about",
      fd
    );

    alert("Updated");
  } catch (err) {
    console.log(err);
  }
};

  if (loading)
    return <div>Loading...</div>;

  return (
    <div className="form-page">
      <h2>
        Edit About Page
      </h2>

      {/* HERO */}
      <h3>Hero Section</h3>

      <input
        name="hero_title"
        value={
          form.hero_title
        }
        onChange={
          handleChange
        }
        placeholder="Hero Title"
      />

      <input
        name="hero_subtitle"
        value={
          form.hero_subtitle
        }
        onChange={
          handleChange
        }
        placeholder="Hero Subtitle"
      />

      <input
        type="file"
        onChange={(e) =>
          handleFile(
            "hero_image",
            e.target
              .files[0]
          )
        }
      />

      {/* INTRO */}
      <h3>
        Company Intro
      </h3>

      <input
        name="intro_title"
        value={
          form.intro_title
        }
        onChange={
          handleChange
        }
        placeholder="Intro Title"
      />

      <textarea
        name="intro_para1"
        value={
          form.intro_para1
        }
        onChange={
          handleChange
        }
        placeholder="Intro Paragraph 1"
      />

      <textarea
        name="intro_para2"
        value={
          form.intro_para2
        }
        onChange={
          handleChange
        }
        placeholder="Intro Paragraph 2"
      />

      <input
        type="file"
        onChange={(e) =>
          handleFile(
            "intro_image",
            e.target
              .files[0]
          )
        }
      />

      {/* STATS */}
      <h3>Stats Section</h3>

      {[1, 2, 3, 4].map(
        (num) => (
          <div key={num}>
            <input
              name={`stat${num}_number`}
              value={
                form[
                  `stat${num}_number`
                ]
              }
              onChange={
                handleChange
              }
              placeholder={`Stat ${num} Number`}
            />

            <input
              name={`stat${num}_text`}
              value={
                form[
                  `stat${num}_text`
                ]
              }
              onChange={
                handleChange
              }
              placeholder={`Stat ${num} Text`}
            />
          </div>
        )
      )}

      {/* MISSION + VISION */}
      <h3>
        Mission & Vision
      </h3>

      <textarea
        name="mission"
        value={
          form.mission
        }
        onChange={
          handleChange
        }
        placeholder="Mission"
      />

      <textarea
        name="vision"
        value={
          form.vision
        }
        onChange={
          handleChange
        }
        placeholder="Vision"
      />

      {/* VALUES */}
      <h3>
        Core Values
      </h3>

      {[1, 2, 3, 4].map(
        (num) => (
          <div key={num}>
            <input
              name={`value${num}_title`}
              value={
                form[
                  `value${num}_title`
                ]
              }
              onChange={
                handleChange
              }
              placeholder={`Value ${num} Title`}
            />

            <textarea
              name={`value${num}_desc`}
              value={
                form[
                  `value${num}_desc`
                ]
              }
              onChange={
                handleChange
              }
              placeholder={`Value ${num} Description`}
            />
          </div>
        )
      )}

      {/* CTA */}
      <h3>CTA Section</h3>

      <input
        name="cta_title"
        value={
          form.cta_title
        }
        onChange={
          handleChange
        }
        placeholder="CTA Title"
      />

      <input
        name="cta_subtitle"
        value={
          form.cta_subtitle
        }
        onChange={
          handleChange
        }
        placeholder="CTA Subtitle"
      />

      <input
        name="cta_button_text"
        value={
          form.cta_button_text
        }
        onChange={
          handleChange
        }
        placeholder="CTA Button Text"
      />

      {/* SEO */}
      <h3>
        SEO Settings
      </h3>

      <input
        name="seo_title"
        value={
          form.seo_title
        }
        onChange={
          handleChange
        }
        placeholder="SEO Title"
      />

      <textarea
        name="seo_description"
        value={
          form.seo_description
        }
        onChange={
          handleChange
        }
        placeholder="SEO Description"
      />

      <input
        name="seo_keywords"
        value={
          form.seo_keywords
        }
        onChange={
          handleChange
        }
        placeholder="SEO Keywords"
      />

      <textarea
        name="seo_schema"
        value={
          form.seo_schema
        }
        onChange={
          handleChange
        }
        placeholder="SEO Schema"
      />

      <button
        className="btn primary"
        onClick={save}
      >
        Save
      </button>
    </div>
  );
}