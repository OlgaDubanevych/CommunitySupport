export default function ResultItem({question_category, question_text, hasComments, comments}) {
  return (
    <main>
      <li>
        {question_category} <p></p> {question_text} <p></p> {(hasComments ? 'Has Comments: ✓' : 'No comemnts yet ✕')} <p></p> {[comments]}
      </li>
    </main>
  )
}

