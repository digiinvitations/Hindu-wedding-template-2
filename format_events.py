import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Add a function to format date
date_format_func = """  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Check if it's in YYYY-MM-DD format
    if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    return dateStr;
  };
"""
# insert before component return
if "formatEventDate" not in code:
    code = code.replace("  const totalAttending =", date_format_func + "\n  const totalAttending =")

# Replace the event map rendering block
old_event_block_regex = r"\{config\.weddingEvents\.map\(\(event, index\) => \{.*?\n\s+return \(\s*<motion\.div.*?\n\s*key=\{index\}.*?className=\"flex flex-col items-center text-center\"\s*>\s*<span className=\"font-sans text-xs uppercase tracking-\[0\.2em\] text-\[#765E52\] font-semibold mb-2\">\s*\{event\.time\}\s*</span>\s*<h3 className=\"font-accent text-4xl md:text-5xl text-\[#B94E2F\] mb-6\">\s*\{event\.eventName\}\s*</h3>\s*\{/\* Media Card \*/\}\s*<div className=\"relative w-full aspect-\[4/5\] md:aspect-video rounded-2xl overflow-hidden shadow-\[0_10px_40px_rgb\(0,0,0,0\.08\)\] mb-6 border border-white/50\">.*?<div className=\"absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none\" />\s*</div>\s*<p className=\"font-serif-premium text-\[#4B3A35\] text-sm md:text-base mb-6 px-4\">\s*\{event\.venueName\}, \{event\.venueAddress\}\s*</p>\s*\{\(event\.mapDirectionsUrl \|\| event\.mapEmbedUrl\) && \(\s*<a\s*href=\{event\.mapDirectionsUrl \|\| event\.mapEmbedUrl\}\s*target=\"_blank\"\s*rel=\"noopener noreferrer\"\s*className=\"inline-flex flex-row items-center gap-2 bg-\[#B94E2F\] text-white px-6 py-2\.5 rounded-full font-sans text-\[10px\] uppercase tracking-\[0\.2em\] hover:bg-\[#8F3B22\] transition-colors shadow-md\"\s*>\s*<MapPin size=\{12\} />\s*VIEW ON MAPS\s*</a>\s*\)\}\s*</motion\.div>\s*\);\s*\}\)\}"

new_event_block = """{config.weddingEvents.map((event, index) => {
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#765E52] font-semibold mb-2">
                      {formatEventDate(event.time)}
                    </span>
                    <h3 className="font-accent text-5xl md:text-6xl text-[#B94E2F] mb-6">
                      {event.eventName}
                    </h3>
                    
                    {/* Media Card */}
                    {event.thumbnailUrl && (
                      <div className="relative w-full max-w-xs md:max-w-sm aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.08)] mb-6 border border-white/50">
                        {event.thumbnailUrl?.endsWith('.mp4') || event.thumbnailUrl?.endsWith('.webm') ? (
                          <video 
                            src={event.thumbnailUrl} 
                            className="w-full h-full object-cover"
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                          />
                        ) : (
                          <FirestoreImage 
                            path={event.thumbnailUrl} 
                            alt={event.eventName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                      </div>
                    )}

                    <p className="font-serif-premium text-[#4B3A35] text-sm md:text-base mb-6 px-4">
                      {event.venueName}, {event.venueAddress}
                    </p>
                    
                    {(event.mapDirectionsUrl || event.mapEmbedUrl) && (
                      <a 
                        href={event.mapDirectionsUrl || event.mapEmbedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-row items-center gap-2 bg-[#B94E2F] text-white px-6 py-2.5 rounded-full font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-[#8F3B22] transition-colors shadow-md"
                      >
                        <MapPin size={12} />
                        VIEW ON MAPS
                      </a>
                    )}
                  </motion.div>
                );
              })}"""

code = re.sub(old_event_block_regex, new_event_block, code, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Updated App.tsx")
