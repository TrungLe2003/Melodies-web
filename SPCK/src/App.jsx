import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import jwt_decode from "jwt-decode";

//component
import MainPage from "../component/Main";
import SignInPage from "../component/SignIn";
import SignUpPage from "../component/SignUp";
import HomePage from "../component/HomePage";
import SearchPage from "../component/searchPage";
import AlbumPage from "../component/AlbumPage";
import SongPage from "../component/MusicPage";
import ArtistPage from "../component/ArtistPage";
import ProfileUserPage from "../component/ProfileUserPage";
import BecomeArtistPage from "../component/BecomeArtist";
import AudioPlayerBar from "../component/AudioPlayerBar";
import ArtistManagePage from "../component/ArtistManage";
import ArtistManageSongPage from "../component/ArtistManage/ManageSong";
import ArtistManageAlbumPage from "../component/ArtistManage/ManageAlbum";
import CatComponent from "./assets/Cat";
//
import AccountPage from "../component/setAccountPage";
import SetAccountMainPage from "../component/setAccountPage/mainPage";
import AccPrivacyPage from "../component/setAccountPage/AccountPrivacyPage";
//css
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/cat" element={<CatComponent />} />
        <Route path="/account" element={<AccountPage />}>
          <Route index element={<SetAccountMainPage />} />
          <Route path="accountPrivacy" element={<AccPrivacyPage />} />
        </Route>
        <Route path="/" element={<MainPage></MainPage>}>
          <Route index element={<HomePage></HomePage>}></Route>
          <Route path="/search" element={<SearchPage></SearchPage>}></Route>
          <Route
            path="/album/:albumId"
            element={<AlbumPage></AlbumPage>}
          ></Route>
          <Route path="/song/:songId" element={<SongPage></SongPage>}></Route>
          <Route
            path="/artist/:artistId"
            element={<ArtistPage></ArtistPage>}
          ></Route>
          <Route
            path="/user"
            element={<ProfileUserPage></ProfileUserPage>}
          ></Route>
        </Route>
        <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
        <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
        <Route
          path="/become-artist"
          element={<BecomeArtistPage></BecomeArtistPage>}
        ></Route>
        <Route
          path="/artistManage/:artistId"
          element={<ArtistManagePage></ArtistManagePage>}
        >
          <Route
            path=""
            element={<ArtistManageSongPage></ArtistManageSongPage>}
          ></Route>
          <Route
            path="manageAlbums"
            element={<ArtistManageAlbumPage></ArtistManageAlbumPage>}
          ></Route>
        </Route>
      </Routes>
      <AudioPlayerBar></AudioPlayerBar>
    </div>
  );
}

export default App;
