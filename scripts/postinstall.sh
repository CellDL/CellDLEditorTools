#!bin/sh

# We want directories to have a mode of 755
umask 022

# Copy BG-RDF into assets
mkdir -p ./src/assets/bg-rdf
cp -p ./BG-RDF/schema/ontology.ttl ./src/assets/bg-rdf
mkdir -p ./src/assets/bg-rdf/templates
cp -p ./BG-RDF/templates/*.ttl ./src/assets/bg-rdf/templates
