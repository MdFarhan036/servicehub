import { db } from "../config/db.js";

/* ================= GET ================= */
export const getAbout = async (
  req,
  res
) => {
  try {
    const [rows] =
      await db.query(
        "SELECT * FROM about ORDER BY id DESC LIMIT 1"
      );

    res.json(
      rows[0] || null
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "Failed to fetch About"
    });
  }
};

/* ================= CREATE / UPDATE ================= */
export const upsertAbout =
  async (req, res) => {
    try {
      const {
        hero_title,
        hero_subtitle,

        intro_title,
        intro_para1,
        intro_para2,

        stat1_number,
        stat1_text,

        stat2_number,
        stat2_text,

        stat3_number,
        stat3_text,

        stat4_number,
        stat4_text,

        mission,
        vision,

        value1_title,
        value1_desc,

        value2_title,
        value2_desc,

        value3_title,
        value3_desc,

        value4_title,
        value4_desc,

        cta_title,
        cta_subtitle,
        cta_button_text,

        seo_title,
        seo_description,
        seo_keywords,
        seo_schema
      } = req.body;

      /* FILES */
      const hero_image_url =
        req.files?.hero_image
          ? `/uploads/${req.files.hero_image[0].filename}`
          : null;

      const intro_image_url =
        req.files?.intro_image
          ? `/uploads/${req.files.intro_image[0].filename}`
          : null;

      /* CHECK EXISTING */
      const [rows] =
        await db.query(
          "SELECT * FROM about LIMIT 1"
        );

      if (
        rows.length > 0
      ) {
        await db.query(
          `
        UPDATE about SET
          hero_title=?,
          hero_subtitle=?,

          intro_title=?,
          intro_para1=?,
          intro_para2=?,

          stat1_number=?,
          stat1_text=?,

          stat2_number=?,
          stat2_text=?,

          stat3_number=?,
          stat3_text=?,

          stat4_number=?,
          stat4_text=?,

          mission=?,
          vision=?,

          value1_title=?,
          value1_desc=?,

          value2_title=?,
          value2_desc=?,

          value3_title=?,
          value3_desc=?,

          value4_title=?,
          value4_desc=?,

          cta_title=?,
          cta_subtitle=?,
          cta_button_text=?,

          seo_title=?,
          seo_description=?,
          seo_keywords=?,
          seo_schema=?,

          hero_image_url = COALESCE(?, hero_image_url),
          intro_image_url = COALESCE(?, intro_image_url)

        WHERE id=?
        `,
          [
            hero_title,
            hero_subtitle,

            intro_title,
            intro_para1,
            intro_para2,

            stat1_number,
            stat1_text,

            stat2_number,
            stat2_text,

            stat3_number,
            stat3_text,

            stat4_number,
            stat4_text,

            mission,
            vision,

            value1_title,
            value1_desc,

            value2_title,
            value2_desc,

            value3_title,
            value3_desc,

            value4_title,
            value4_desc,

            cta_title,
            cta_subtitle,
            cta_button_text,

            seo_title,
            seo_description,
            seo_keywords,
            seo_schema,

            hero_image_url,
            intro_image_url,

            rows[0].id
          ]
        );

        return res.json({
          message:
            "Updated successfully"
        });
      }

      /* INSERT */
    await db.query(
  `
  INSERT INTO about (
    hero_title,
    hero_subtitle,

    intro_title,
    intro_para1,
    intro_para2,

    stat1_number,
    stat1_text,

    stat2_number,
    stat2_text,

    stat3_number,
    stat3_text,

    stat4_number,
    stat4_text,

    mission,
    vision,

    value1_title,
    value1_desc,

    value2_title,
    value2_desc,

    value3_title,
    value3_desc,

    value4_title,
    value4_desc,

    cta_title,
    cta_subtitle,
    cta_button_text,

    seo_title,
    seo_description,
    seo_keywords,
    seo_schema,

    hero_image_url,
    intro_image_url
  )
  VALUES (
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?
  )
`,
  [
    hero_title,
    hero_subtitle,

    intro_title,
    intro_para1,
    intro_para2,

    stat1_number,
    stat1_text,

    stat2_number,
    stat2_text,

    stat3_number,
    stat3_text,

    stat4_number,
    stat4_text,

    mission,
    vision,

    value1_title,
    value1_desc,

    value2_title,
    value2_desc,

    value3_title,
    value3_desc,

    value4_title,
    value4_desc,

    cta_title,
    cta_subtitle,
    cta_button_text,

    seo_title,
    seo_description,
    seo_keywords,
    seo_schema,

    hero_image_url,
    intro_image_url
  ]
);

      res.json({
        message:
          "Created successfully"
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        message:
          "Save failed"
      });
    }
  };