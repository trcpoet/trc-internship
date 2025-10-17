import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from 'axios'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import Skeleton from "../UI/Skeleton";



const HotCollections = () => {
  const [collections, setCollections] = useState([]); 
  const [loading, setLoading] = useState(true);

  // const [sliderRef, instanceRef] = useKeenSlider(
  //   {
  //     slideChanged() {
  //       console.log('slide changed')
  //     },
  //   },
  //   [
  //     // add plugins here
  //   ]
  // )

    useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        // Ensure we always set an array even if the API returns something unexpected
        setCollections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch hot collections:", error);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);



  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading
            ? new Array(4).fill(0).map((_, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft_coll">
                    {/* Skeleton for the NFT image */}
                    <Skeleton width="100%" height="200px" borderRadius="8px" />

                <div className="nft_wrap">
                  <Link to="/item-details">
                    <img src={nftImage} className="lazy img-fluid" alt="" />
                  </Link>
                </div>
                
                <div className="nft_coll_pp" style={{ marginTop: "-25px" }}> 
                  <Skeleton width="50px" height="50px" borderRadius="50%" />
                  <Link to="/author">
                    <img className="lazy pp-coll" src={AuthorImage} alt="" />
                  </Link>
                  <i className="fa fa-check"></i>
                </div>
                <div className="nft_coll_info">
                  <Link to="/explore">
                    <h4>Pinky Ocean</h4><h4>Loading…</h4>
                      </Link>
                      <span>Loading…</span>
                    </div>
                  </div>
                </div>
              ))
              : collections.map((collection) => (        
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={collection.id}>
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to={`/item-details/${collection.nftId || collection.id}`}>
                        <img
                          src={collection.nftImage || nftImage}
                          className="lazy img-fluid"
                          alt={collection.title}
                        />
                      </Link>
                    </div>
                    <div className="nft_coll_pp">
                      <Link to={`/author/${collection.authorId || collection.id}`}>
                        <img
                          className="lazy pp-coll"
                          src={collection.authorImage || AuthorImage}
                          alt={collection.title}
                        />
                      </Link>
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="nft_coll_info">
                      <Link to="/explore">
                        <h4>{collection.title}</h4>
                      </Link>
                      <span>{collection.code}</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;