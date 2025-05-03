
const ClientLogos = () => {
  // Sample client logos (replace with actual client logos)
  const clients = [
    { id: 1, name: "Client 1" },
    { id: 2, name: "Client 2" },
    { id: 3, name: "Client 3" },
    { id: 4, name: "Client 4" },
    { id: 5, name: "Client 5" },
    { id: 6, name: "Client 6" },
  ];

  return (
    <section className="bg-doodle-gray py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h3 className="text-center text-gray-500 mb-10 uppercase tracking-wide text-sm font-medium">Trusted by leading brands</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-80">
          {clients.map((client) => (
            <div key={client.id} className="grayscale hover:grayscale-0 transition-all duration-300">
              {/* Replace this div with actual client logos */}
              <div className="bg-gray-300 h-12 w-24 rounded flex items-center justify-center">
                {client.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
