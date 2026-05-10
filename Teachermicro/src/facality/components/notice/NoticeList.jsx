import NoticeItem from "./NoticeItem";

const NoticeList = ({ data, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {data?.map((notice) => (
        <NoticeItem
          key={notice._id}
          notice={notice}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NoticeList;



