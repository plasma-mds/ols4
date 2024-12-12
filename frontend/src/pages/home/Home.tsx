import moment from "moment";
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Banner } from "../../components/Banner";
import Header from "../../components/Header";
import SearchBox from "../../components/SearchBox";
import { getBannerText, getStats } from "./homeSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Home() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.home.stats);
  const banner = useAppSelector((state) => state.home.bannerText);

  /*

  The following code handles a special case where the user is redirected to the class page of a term.
  The service which initiates this workflow is the ebi lookup service. http://www.ebi.ac.uk/ontology-lookup/?termId=ECO:0000353
  this url redirects to the OLS class page. It used to work in OLS3 but not in OLS 4. The following code is a workaround to make it work in OLS 4.

  Refer to this RT ticket for further details: https://helpdesk.ebi.ac.uk/Ticket/Display.html?id=714111

  */

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const termId = searchParams.get("termId");
  const [iri, setIri] = useState('');

  useEffect(() => {
    const fetchEntity = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_APIURL}api/v2/entities?search=${termId}`);
        const data = await response.json();
        const entity = data.elements[0];
        setIri(entity.iri);
      } catch (error) {
        console.error('Failed to fetch entity:', error);
      }
    };

    if (termId) {
      fetchEntity();
    }
  }, [termId]);

  useEffect(() => {
    if (iri && termId) {
      navigate(`/ontologies/${termId.split(':')[0].toLowerCase()}/classes?iri=${encodeURIComponent(iri)}`);
    }
  }, [iri, navigate]);

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBannerText());
  }, [dispatch]);

  if (banner !== "") console.log(banner);

  document.title = "Ontology Lookup Service (OLS)";
  return (
    <div>
      <Header section="home" />
      <main className="container mx-auto px-4 h-fit">
        {banner !== "" && (
          <div className="mt-4">
            <Banner type="info">{banner}</Banner>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-r from-neutral-light to-white rounded-lg my-8 p-8">
              <div className="text-3xl mb-4 text-neutral-black font-bold">
                Welcome to the Plasma-MDS Ontology Lookup Service
              </div>
              <div className="flex flex-nowrap gap-4 mb-4">
                <SearchBox />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <div className="text-neutral-black">
                  <span>
                    Examples:&nbsp;
                    <Link to={"/search?q=diabetes"} className="link-default">
                      diabetes
                    </Link>
                    &#44;&nbsp;
                    <Link to={"/search?q=GO:0098743"} className="link-default">
                      GO:0098743
                    </Link>
                  </span>
                </div>
                <div className="md:text-right">
                  <Link to={"/ontologies"} className="link-default">
                    Looking for a particular ontology?
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
              <div className="px-2">
                <div className="text-2xl mb-3 text-neutral-default">
                  <i className="icon icon-common icon-browse icon-spacer text-yellow-default" />
                  <Link to={"/about"} className="link-default">
                    About OLS
                  </Link>
                </div>
                <p>
                  The Ontology Lookup Service (OLS) is a repository for
                  ontologies that aims to provide a single point of
                  access to the latest ontology versions. You can browse the
                  ontologies through the website as well as programmatically via
                  the OLS API. The OLS software is developed and maintained by the&thinsp;
                  <a
                    className="link-default"
                    href={process.env.REACT_APP_SPOT_HOME}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Samples, Phenotypes and Ontologies Team (SPOT)
                  </a>&thinsp;
                  at&thinsp;
                  <a
                    className="link-default"
                    href={process.env.REACT_APP_EBI_HOME}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    EMBL-EBI
                  </a>
                  .
                  This OLS instance is currently maintained by the 
                  research programme Smart Data Technologies at the
                  <a
                    className="link-default"
                    href="https://www.inp-greifswald.de"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                  Leibniz Institute for Plasma Science and Technology (INP)
                  </a>
                  in Greifswald, Germany.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 lg:order-none order-first">
            <div className="shadow-card border-b-8 border-link-default rounded-md mt-8 p-4">
              <div className="text-2xl text-neutral-black font-bold mb-3">
                <i className="icon icon-common icon-analyse-graph icon-spacer" />
                <span>Data Content</span>
              </div>
              {stats ? (
                <div className="text-neutral-black">
                  <div className="mb-2 text-sm italic">
                    Updated&nbsp;
                    {moment(stats.lastModified).format(
                      "D MMM YYYY ddd HH:mm(Z)"
                    )}
                  </div>
                  <ul className="list-disc list-inside pl-2">
                    <li>
                      {stats.numberOfOntologies.toLocaleString()} ontologies
                    </li>
                    <li>{stats.numberOfClasses.toLocaleString()} classes</li>
                    <li>
                      {stats.numberOfProperties.toLocaleString()} properties
                    </li>
                    <li>
                      {stats.numberOfIndividuals.toLocaleString()} individuals
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="text-center">
                  <div className="spinner-default w-7 h-7" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
