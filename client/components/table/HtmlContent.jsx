const HtmlContent = ({ html }) => {
  return (
    <tbody
      className="[&_tr:last-child]:border-0  border-collapse "
      dangerouslySetInnerHTML={{ __html: html }}
    ></tbody>
  );
};

export default HtmlContent;
