import RequestQuoteModal from '../../components/RequestQuoteModal';

function MachinePage({ machine }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{machine.name}</h1>
      <p className="mb-1"><strong>Stock #:</strong> {machine.stockNumber}</p>
      <p className="mb-1"><strong>Year of Mfg.:</strong> {machine.yearOfMfg}</p>
      <p className="mb-4"><strong>Specifications:</strong> {machine.specifications}</p>

      {/* Display multiple images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {machine.images?.map((img, i) => (
          <img
            key={i}
            src={img.asset.url}
            alt={machine.name}
            className="w-full h-auto rounded"
          />
        ))}
      </div>

      {/* Request Quote Modal */}
      <RequestQuoteModal stockNumber={machine.stockNumber} />
    </div>
  );
}

export default MachinePage;
