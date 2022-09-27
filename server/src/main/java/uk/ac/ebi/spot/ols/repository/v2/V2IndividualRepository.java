
package uk.ac.ebi.spot.ols.repository.v2;

import com.google.gson.Gson;
import org.apache.solr.client.solrj.SolrQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import uk.ac.ebi.spot.ols.model.v2.V2Individual;
import uk.ac.ebi.spot.ols.model.v2.V2Ontology;
import uk.ac.ebi.spot.ols.repository.Neo4jQueryHelper;
import uk.ac.ebi.spot.ols.repository.OlsSolrQuery;
import uk.ac.ebi.spot.ols.repository.SolrQueryHelper;
import uk.ac.ebi.spot.ols.repository.Validation;

import javax.validation.Valid;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class V2IndividualRepository {

    @Autowired
    SolrQueryHelper solrQueryHelper;

    @Autowired
    Neo4jQueryHelper neo4jQueryHelper;


    public Page<V2Individual> find(
            Pageable pageable, String lang, String search, String searchFields, Map<String,String> properties) throws IOException {

        Validation.validateLang(lang);

        if(search != null && searchFields == null) {
            searchFields = "http://www.w3.org/2000/01/rdf-schema#label^100 definition";
        }

        OlsSolrQuery query = new OlsSolrQuery();
	query.setSearch(search, searchFields);
	query.addFilter("lang", lang, true);
	query.addFilter("type", "individual", true);
        query.addDynamicFilterProperties(properties);

        return solrQueryHelper.searchSolrPaginated(query, pageable)
                .map(result -> new V2Individual(result, lang));
    }

    public Page<V2Individual> findByOntologyId(
            String ontologyId, Pageable pageable, String lang, String search, String searchFields, Map<String,String> properties) throws IOException {

        Validation.validateOntologyId(ontologyId);
        Validation.validateLang(lang);

        if(search != null && searchFields == null) {
            searchFields = "http://www.w3.org/2000/01/rdf-schema#label^100 definition";
        }

        OlsSolrQuery query = new OlsSolrQuery();
	query.setSearch(search, searchFields);
	query.addFilter("lang", lang, true);
	query.addFilter("type", "individual", true);
	query.addFilter("ontologyId", ontologyId, true);
        query.addDynamicFilterProperties(properties);

        return solrQueryHelper.searchSolrPaginated(query, pageable)
                .map(result -> new V2Individual(result, lang));

    }

    public V2Individual getByOntologyIdAndUri(String ontologyId, String uri, String lang) throws ResourceNotFoundException {

        Validation.validateOntologyId(ontologyId);
        Validation.validateLang(lang);

        OlsSolrQuery query = new OlsSolrQuery();
	query.addFilter("lang", lang, true);
	query.addFilter("type", "individual", true);
	query.addFilter("ontologyId", ontologyId, true);
	query.addFilter("uri", uri, true);

        return new V2Individual(solrQueryHelper.getOne(query), lang);
    }


}

