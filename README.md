# Final Project Proposal - Junaid Ahmed
## Title: Protein Analysis Tool

### Description
For my final project, I plan to build a web app in which users can query
up to 5 protein sequences from a keyword search and be shown detailed analyses of those protein
sequences (tabbed/on link click). I plan on using the pypdb, biopandas, and
matplotlib libraries in python to create this app.

The tool will initially ask the user for a keyword input. For example, if they want to query protein sequences that have the keyword 'human', they will type the word 'human' in the input text field of the html form. Then, the keyword will be passed to the mysql string query. The query will be executed using the mysql connector, and once the query results have been returned, the connection will be closed. No results will be displayed until all fields have been queried. This will be handled with Javascript and jquery. 

Next, the pypdb package will be used to query the PDB code for the protein sequence. PDB codes are used in the Protein Data Bank and store details of all protein sequences (e.g. molecular weight, pubmed article information, number of residues, number of atoms, count breakdown by amino acid, etc). This information will be the first set of data returned for a particular protein sequence.

The biopandas package will be used to query all coordinate information for the PDB code(s) obtained from Protein Data Bank. Pandas is a popular python dataframe library used by data scientists and analysts. Biopandas builds off this library, but it incorporates biological data and properly formats it according to the type of data. The tool will query the 'ATOM' coordinate data from the data returned as a result of the biopandas query of the PDB. 

Now that the tool has pulled in coordinate info for PDB(s) for the individual protein sequences, the protein structure will be shown to the user as well in an interactive 3d plot. This will be achieved using the matplotlib 3d charting library. 


(More details added soon...) 
