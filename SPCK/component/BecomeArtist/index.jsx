import "./style.css";
//
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const BecomeArtistPage = () => {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const handleBecomeArtist = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You need to sign in first.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:8081/api/v1/user/become-artist",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Failed to upgrade to artist.");
    } finally {
      setLoading(false);
      nav("/");
    }
  };
  return (
    <div className="BArtistPage">
      <div className="HeaderFrame">
        <div className="content">
          <div className="logo" onClick={() => nav("/")}>
            Melodies
          </div>
          <div className="contentFrame">
            <h1>Get your music in front of millions.</h1>
            <p>All it takes is an upload.</p>
            <p>
              Music obsessives and industry insiders have always come to
              Melodies to discover and define what’s next in music. It worked
              for Billie Eilish, Doja Cat, Post Malone, and you could be next.
            </p>
            <button
              className="bcmArtistBtn"
              onClick={handleBecomeArtist}
              disabled={loading}
            >
              {loading ? "Processing..." : "Become an Artist"}
            </button>
          </div>
        </div>
      </div>
      <div className="BArtistPageContent">
        <div className="banner">
          <div className="frame">
            <img src="./public/becomeArtistPage/bannerImg1.png" alt="" />
            <h2>Unlimited uploads</h2>
            <p>
              Back-up your entire discography and share with your community and
              collaborators
            </p>
          </div>
          <div className="frame">
            <img src="./public/becomeArtistPage/banner2.png" alt="" />
            <h2>Advanced Insights</h2>
            <p>
              See who’s listening, how they discovered your tracks, and more.
            </p>
          </div>
          <div className="frame">
            <img src="./public/becomeArtistPage/banner3.png" alt="" />
            <h2>Grow your audience</h2>
            <p>
              Our algorithm analyzes and recommends your tracks to 100 or even
              1000 listeners who will love it.
            </p>
          </div>
          <div className="frame">
            <img src="./public/becomeArtistPage/banner4.png" alt="" />
            <h2>Get paid</h2>
            <p>
              Monetize your tracks on SoundCloud, Spotify, YouTube Music, Apple
              Music, and more.
            </p>
          </div>
        </div>
        <div className="frameIntroduce ">
          <div className="content">
            <h1>Get heard, with Next Pro.</h1>
            <p>
              We know how hard you work on your tracks, that’s why we make sure
              it reaches the right audience
            </p>
            <p>
              {" "}
              Next Pro’s predictive audio algorithm analyzes your track and
              recommends it to 100 or even 1000 listeners with similar taste
              based on music they’ve loved in the past.
            </p>
            <button>Get heard</button>
          </div>
          <img src="public/becomeArtistPage/Frame1.png" alt="" />
        </div>
        <div className="frameIntroduce ">
          <img src="public/becomeArtistPage/Frame2.png" alt="" />
          <div className="content">
            <h1>Distribute to all the biggest platforms.</h1>
            <p>
              Why pay for another service, when you can have everything in one
              place? SoundCloud lets you distribute your music everywhere. See
              your tracks on Spotify, Apple Music, and 60+ other platforms: it’s
              included with a Next Pro Subscription.
            </p>
            <button>Start distributing</button>
          </div>
        </div>
        <div className="frameIntroduce ">
          <div className="content">
            <h1>Get paid for your art.</h1>
            <p>
              Artists need to eat too. At SoundCloud, we get that, and we
              believe that streaming should be a solid and dependable source of
              income for artists, full stop.
            </p>
            <p>
              That’s why when you monetize your tracks through SoundCloud, you
              get 100% of royalties from plays there, and can keep earning from
              your streams on other platforms too.
            </p>
            <p>
              And with fan-powered royalties, you get paid based on your fans'
              actual listening habits. Simply put, the more fans that listen to
              your music the more you get paid. Under the old model, money from
              your dedicated fans goes into a giant pool that's paid out to
              artists based on their share of total streams. That model mostly
              benefits mega stars. Fan-powered royalties are a more equitable
              and transparent way for independent artists to get paid.
            </p>
            <button>Get paid</button>
          </div>
          <img src="public/becomeArtistPage/Frame3.png" alt="" />
        </div>
        <div className="frameIntroduce ">
          <img src="public/becomeArtistPage/Frame4.png" alt="" />
          <div className="content">
            <h1>Build your scene, and know your scene.</h1>
            <p>
              Connect directly with fans, other artists, and future
              collaborators to take your career further. SoundCloud is the only
              streaming platform that allows you to easily identify your top
              fans based on their listening and engagement habits and message
              them directly.
            </p>
            <p>
              And with advanced insights, you can get a sense of who your fans
              really are, where they’re located, how they’re discovering your
              tracks, and more.
            </p>
            <button>Get audience insights</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeArtistPage;
