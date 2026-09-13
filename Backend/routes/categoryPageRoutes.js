import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

// get by category
router.get("/:categoryId", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT * 
      FROM category_page_content
      WHERE category_id=?
      LIMIT 1
      `,
      [req.params.categoryId]
    );

    res.json(rows[0] || null);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Fetch failed"
    });
  }
});

// create/update
router.post("/", async (req, res) => {
  try {
    const {
      category_id,
      about_title,
      about_description,
      why_choose_title,
      why_choose_description,
      faq_question_1,
      faq_answer_1,
      faq_question_2,
      faq_answer_2,
      seo_title,
      seo_description,
      seo_keywords
    } = req.body;

    const [existing] =
      await db.query(
        `
        SELECT id
        FROM category_page_content
        WHERE category_id=?
        `,
        [category_id]
      );

    if (existing.length > 0) {
      await db.query(
        `
        UPDATE category_page_content
        SET
        about_title=?,
        about_description=?,
        why_choose_title=?,
        why_choose_description=?,
        faq_question_1=?,
        faq_answer_1=?,
        faq_question_2=?,
        faq_answer_2=?,
        seo_title=?,
        seo_description=?,
        seo_keywords=?
        WHERE category_id=?
        `,
        [
          about_title,
          about_description,
          why_choose_title,
          why_choose_description,
          faq_question_1,
          faq_answer_1,
          faq_question_2,
          faq_answer_2,
          seo_title,
          seo_description,
          seo_keywords,
          category_id
        ]
      );
    } else {
      await db.query(
        `
        INSERT INTO category_page_content (
          category_id,
          about_title,
          about_description,
          why_choose_title,
          why_choose_description,
          faq_question_1,
          faq_answer_1,
          faq_question_2,
          faq_answer_2,
          seo_title,
          seo_description,
          seo_keywords
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
          category_id,
          about_title,
          about_description,
          why_choose_title,
          why_choose_description,
          faq_question_1,
          faq_answer_1,
          faq_question_2,
          faq_answer_2,
          seo_title,
          seo_description,
          seo_keywords
        ]
      );
    }

    res.json({
      message: "Saved"
    });

  } catch (err) {
    console.log(err);
  }
});

export default router;