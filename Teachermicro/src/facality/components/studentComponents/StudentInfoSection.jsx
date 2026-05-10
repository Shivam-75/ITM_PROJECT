export default function StudentInfoSection({ title, data }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {data.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



