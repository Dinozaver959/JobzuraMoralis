function StarIc(props) {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="linkButton" type="button">
        <svg
          viewBox="0 0 15 15"
          width={props.size}
          height={props.size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={props.color}
            d="M6.60326 1.31699C6.97008 0.573739 8.02992 0.57374 8.39674 1.31699L9.76542 4.09024C9.91108 4.38538 10.1926 4.58995 10.5184 4.63728L13.5788 5.08199C14.399 5.20117 14.7265 6.20915 14.133 6.78768L11.9185 8.94636C11.6828 9.17609 11.5752 9.50709 11.6309 9.83149L12.1537 12.8796C12.2938 13.6965 11.4363 14.3195 10.7027 13.9338L7.96534 12.4946C7.67402 12.3415 7.32598 12.3415 7.03466 12.4946L4.2973 13.9338C3.56367 14.3195 2.70624 13.6965 2.84635 12.8796L3.36914 9.83149C3.42478 9.50709 3.31723 9.17609 3.08154 8.94636L0.866968 6.78768C0.273451 6.20915 0.600962 5.20117 1.42118 5.08199L4.48165 4.63728C4.80736 4.58995 5.08892 4.38538 5.23458 4.09024L6.60326 1.31699Z"
          />
        </svg>
      </button>
    );
  }

  return (
    <svg
      viewBox="0 0 15 15"
      width={props.size}
      height={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={props.color}
        d="M6.60326 1.31699C6.97008 0.573739 8.02992 0.57374 8.39674 1.31699L9.76542 4.09024C9.91108 4.38538 10.1926 4.58995 10.5184 4.63728L13.5788 5.08199C14.399 5.20117 14.7265 6.20915 14.133 6.78768L11.9185 8.94636C11.6828 9.17609 11.5752 9.50709 11.6309 9.83149L12.1537 12.8796C12.2938 13.6965 11.4363 14.3195 10.7027 13.9338L7.96534 12.4946C7.67402 12.3415 7.32598 12.3415 7.03466 12.4946L4.2973 13.9338C3.56367 14.3195 2.70624 13.6965 2.84635 12.8796L3.36914 9.83149C3.42478 9.50709 3.31723 9.17609 3.08154 8.94636L0.866968 6.78768C0.273451 6.20915 0.600962 5.20117 1.42118 5.08199L4.48165 4.63728C4.80736 4.58995 5.08892 4.38538 5.23458 4.09024L6.60326 1.31699Z"
      />
    </svg>
  );
}

export default StarIc;