type IDemoComponentProps = {
  content: string;
};

export const DemoComponent = ({ content }: IDemoComponentProps) => {
  return <div>{content}</div>;
};
