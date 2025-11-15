import express from "express";
import nodemailer from "nodemailer";
import { pool } from "./db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, phone, message } = req.body;

  try {
    // 1) DB INSERT (너의 테이블 구조 반영)
    const insertQuery = `
      INSERT INTO public.inquiry
      (id, "name", phone, subject, message, sent_dt)
      VALUES (nextval('inquiry_id_seq'), $1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id;
    `;

    // subject는 문의 고정 값 또는 프론트에서 입력 가능  
    const subject = "GKClean 세탁 서비스 문의";

    const result = await pool.query(insertQuery, [
      name,
      phone,
      subject,
      message,
    ]);

    console.log("DB 저장 완료 ⇒ ID:", result.rows[0].id);

    // 2) 이메일 발송
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: `[GKClean 문의 접수] ${name}님`,
      text: `문의가 접수되었습니다.

이름: ${name}
연락처: ${phone}
문의내용:
${message}

※ 관리자 페이지에서 확인하세요.
`,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("문의 처리 실패:", error);
    return res.status(500).json({ success: false, error: "서버 오류" });
  }
});

export default router;
