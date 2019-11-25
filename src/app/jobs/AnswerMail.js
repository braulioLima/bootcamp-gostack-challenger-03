import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student_name, email, question, answer, answer_at } = data;

    await Mail.sendMail({
      to: `${student_name} <${email}>`,
      subject: 'Resposta a pergunta',
      template: 'answer',
      context: {
        student: student_name,
        question,
        answer,
        answer_at,
      },
    });
  }
}

export default new AnswerMail();
