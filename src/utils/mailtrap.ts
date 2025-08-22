import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN ?? "";
const INBOX_ID = process.env.MAILTRAP_INBOX ?? "";

const mailtrap = new MailtrapClient({
  token: TOKEN,
  testInboxId: Number.parseInt(INBOX_ID),
});

export default mailtrap;
