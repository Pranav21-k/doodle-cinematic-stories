
import React from 'react';

const ClientLogos = () => {
  // Real client logos with brand names
  const clients = [
    { id: 1, name: "Lulu", logo: "/placeholder.svg" },
    { id: 2, name: "H&M", logo: "/placeholder.svg" },
    { id: 3, name: "Splash", logo: "/placeholder.svg" },
    { id: 4, name: "Axis Events", logo: "/placeholder.svg" },
    { id: 5, name: "W Muscat", logo: "/placeholder.svg" },
    { id: 6, name: "Danube", logo: "/placeholder.svg" },
  ];

  return (
    <section className="bg-doodle-gray py-12">
      <div className="container mx-auto px-6 md:px-12">
        <h3 className="text-center text-gray-500 mb-10 uppercase tracking-wide text-sm font-medium">Trusted by leading brands</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-80">
          {clients.map((client) => (
            <div key={client.id} className="grayscale hover:grayscale-0 transition-all duration-300">
              <div className="bg-gray-300 h-12 w-24 rounded flex items-center justify-center">
                {client.logo ? (
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="max-h-8" 
                    onError={(e) => {
                      // If image fails to load, show text instead
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerText = client.name;
                    }}
                  />
                ) : (
                  client.name
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
