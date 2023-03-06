export default function getSqlQueryElements<T>(item: T) {
  let fields = "(";
  let questionMarks = "(";

  const values = [];
  for (const key in item) {
    fields += key + ",";
    questionMarks += "?" + ",";
    values.push(item[key]);
  }

  fields = fields.slice(0, -1);
  questionMarks = questionMarks.slice(0, -1);
  fields += ")";
  questionMarks += ")";

  return { values, fields, questionMarks };
}
