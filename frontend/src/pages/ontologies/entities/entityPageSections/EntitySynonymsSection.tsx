import { Fragment } from "react";
import { randomString, sortByKeys } from "../../../../app/util";
import Entity from "../../../../model/Entity";
import LinkedEntities from "../../../../model/LinkedEntities";
import Reified from "../../../../model/Reified";
import MetadataTooltip from "./MetadataTooltip";

export default function EntitySynonymsSection({
  entity,
  linkedEntities,
}: {
  entity: Entity;
  linkedEntities: LinkedEntities;
}) {
  let exactSynonyms = entity.getExactSynonyms();
  let relatedSynonyms = entity.getRelatedSynonyms();
  let narrowSynonyms = entity.getNarrowSynonyms();
  let broadSynonyms = entity.getBroadSynonyms();

  if ((!exactSynonyms || exactSynonyms.length === 0) &&
      (!relatedSynonyms || relatedSynonyms.length === 0) &&
      (!narrowSynonyms || narrowSynonyms.length === 0) &&
      (!broadSynonyms || broadSynonyms.length === 0)) {
    return <Fragment />;
  }

  return (
      <div className="flex flex-col mb-2">
        {exactSynonyms && exactSynonyms.length > 0 && (
            <div className="flex flex-row flex-wrap items-center mb-2">
              <div className="font-bold mr-2">Exact Synonyms</div>
              {exactSynonyms
                  .map((synonym: Reified<any>) => {
                    const hasMetadata = synonym.hasMetadata();
                    return (
                        <div
                            key={synonym.value.toString().toUpperCase() + randomString()}
                            className="bg-grey-default rounded-sm font-mono py-1 px-3 mr-2 my-1 text-sm"
                        >
                          {synonym.value}
                          {hasMetadata && (
                              <MetadataTooltip
                                  metadata={synonym.getMetadata()}
                                  linkedEntities={linkedEntities}
                              />
                          )}
                        </div>
                    );
                  })
                  .sort((a, b) => sortByKeys(a, b))}
            </div>
        )}

        {relatedSynonyms && relatedSynonyms.length > 0 && (
            <div className="flex flex-row flex-wrap items-center mb-2">
              <div className="font-bold mr-2">Related Synonyms</div>
              {relatedSynonyms
                  .map((synonym: Reified<any>) => {
                    const hasMetadata = synonym.hasMetadata();
                    return (
                        <div
                            key={synonym.value.toString().toUpperCase() + randomString()}
                            className="bg-grey-default rounded-sm font-mono py-1 px-3 mr-2 my-1 text-sm"
                        >
                          {synonym.value}
                          {hasMetadata && (
                              <MetadataTooltip
                                  metadata={synonym.getMetadata()}
                                  linkedEntities={linkedEntities}
                              />
                          )}
                        </div>
                    );
                  })
                  .sort((a, b) => sortByKeys(a, b))}
            </div>
        )}

        {narrowSynonyms && narrowSynonyms.length > 0 && (
            <div className="flex flex-row flex-wrap items-center mb-2">
              <div className="font-bold mr-2">Narrow Synonyms</div>
              {narrowSynonyms
                  .map((synonym: Reified<any>) => {
                    const hasMetadata = synonym.hasMetadata();
                    return (
                        <div
                            key={synonym.value.toString().toUpperCase() + randomString()}
                            className="bg-grey-default rounded-sm font-mono py-1 px-3 mr-2 my-1 text-sm"
                        >
                          {synonym.value}
                          {hasMetadata && (
                              <MetadataTooltip
                                  metadata={synonym.getMetadata()}
                                  linkedEntities={linkedEntities}
                              />
                          )}
                        </div>
                    );
                  })
                  .sort((a, b) => sortByKeys(a, b))}
            </div>
        )}

        {broadSynonyms && broadSynonyms.length > 0 && (
            <div className="flex flex-row flex-wrap items-center mb-2">
              <div className="font-bold mr-2">Broad Synonyms</div>
              {broadSynonyms
                  .map((synonym: Reified<any>) => {
                    const hasMetadata = synonym.hasMetadata();
                    return (
                        <div
                            key={synonym.value.toString().toUpperCase() + randomString()}
                            className="bg-grey-default rounded-sm font-mono py-1 px-3 mr-2 my-1 text-sm"
                        >
                          {synonym.value}
                          {hasMetadata && (
                              <MetadataTooltip
                                  metadata={synonym.getMetadata()}
                                  linkedEntities={linkedEntities}
                              />
                          )}
                        </div>
                    );
                  })
                  .sort((a, b) => sortByKeys(a, b))}
            </div>
        )}
      </div>
  );
}