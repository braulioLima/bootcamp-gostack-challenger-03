import Mail from '../../lib/Mail';

class ConfirmationMail {
  get key() {
    return 'ConfirmationMail';
  }

  async handle({ data }) {
    const { name, email, duration, startDate, endDate, total } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Matrícula realizada!',
      template: 'confirmation',
      context: {
        student: name,
        start_date: startDate,
        duration,
        end_date: endDate,
        total,
      },
    });
  }
}

export default new ConfirmationMail();
