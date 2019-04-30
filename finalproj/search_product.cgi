#!/usr/local/bin/python3

import cgi, json
import os
import mysql.connector
import sys
sys.path.append("/opt/Python-3.4.1/lib/python3.4/site-packages")
from pypdb import *
from biopandas.pdb import PandasPdb

def uniq(list_of_dicts):
    list_of_unique_dicts = []
    for dict_ in list_of_dicts:
        if dict_['structureId'] not in list_of_unique_dicts:
            list_of_unique_dicts.append(dict_)
    return list_of_unique_dicts

def main():
    print("Content-Type: application/json\n\n")
    form = cgi.FieldStorage()
    term = form.getvalue('search_term')
    #term = 'bifunctional'  
    conn = mysql.connector.connect(user='jahmed6', password='StephenCurry30', host='localhost', database='jahmed6_chado')
    cursor = conn.cursor()
    
    #qry = """
    #     SELECT f.uniquename locus_id, f.residues product
    #     FROM feature f
    #     WHERE f.name like %s
    #     LIMIT 5
    #"""

    qry = """
        SELECT f.uniquename, f.residues, product.value product
        FROM feature f
            JOIN cvterm polypeptide ON f.type_id=polypeptide.cvterm_id
            JOIN featureprop product ON f.feature_id=product.feature_id
            JOIN cvterm productprop ON product.type_id=productprop.cvterm_id
        WHERE polypeptide.name = 'polypeptide'
            AND productprop.name = 'gene_product_name'
            AND product.value like %s
        LIMIT 5
    """
    cursor.execute(qry, ('%' + term + '%', ))

    results = { 'match_count': 0, 'matches': list() }
    for (locus_id, residue, product) in cursor:
        search_dict = make_query(locus_id.decode())
        search_results = do_search(search_dict)
        #structure_ids = []
        info = []
        for result in search_results:
            protinfo = describe_pdb(result)
            #protinfo = {frozenset(item.items()):item for item in protinfo}.values()
            #print(protinfo)
            refinedinfo = { k:v for k,v in protinfo.items() if k in ["structureId", "title", "pubmedId", "resolution",
            "nr_entities", "nr_residues", "nr_atoms", "expMethod", "deposition_date", "release_date", "structure_authors"] }
            info.append(refinedinfo)
            ids = [v for k,v in protinfo.items() if k=="structureId"]
            #structure_ids.append(ids)
        #structure_ids = [item for sublist in structure_ids for item in sublist]
        #info = uniq(info)
        #print(structure_ids)
        #avg_temps = []
        #for id_ in structure_ids:
        #    ppdb = PandasPdb().fetch_pdb(id_)
        #    ppdb = ppdb.df['ATOM']['element_symbol'].value_counts()
        #    avg_temps.append(ppdb)
            #mainchain = ppdb.df['ATOM'][
            #    (ppdb.df['ATOM']['atom_name'] == 'C') | 
            #    (ppdb.df['ATOM']['atom_name'] == 'O') | 
            #    (ppdb.df['ATOM']['atom_name'] == 'N') | 
            #    (ppdb.df['ATOM']['atom_name'] == 'CA')
            #]
            #bfact_mc_avg = mainchain['b_factor'].mean()
            #avg_temps.append(bfact_mc_avg)
        #ppdb.df['ATOM']['element_symbol'].value_counts().plot(kind='bar')
	#plt.title('Distribution of Atom Types for 3eiy')
	#plt.xlabel('elements')
	#plt.ylabel('count')
        results['matches'].append({'locus_id': locus_id.decode(), 'residue':residue.decode(), 'product': product.decode(), 'protinfo':info})
        results['match_count'] += 1
    #print(results['matches'])
    conn.close()

    print(json.dumps(results))


if __name__ == '__main__':
    main()
