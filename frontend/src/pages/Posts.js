import React from 'react';
import Header from '../components/Header';

const Posts = () => {
    return (
        <div className="posts">
            <Header />
            <div className="container">
                <div className="addEnteteNewPost">Publier un nouveau post</div>
                <div className="addContainerCorpsNewPost">
                    <form>
                        <div className="addCorpsNewPost">
                            <textarea id="" required></textarea>
                            <input type="file" id="imgpost" name="imgpost" />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Envoyer</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="container">
                <div className="addEnteteNewPost">Dernier posts</div>
                <div className="addContainerCorpsNewPost">

                </div>
            </div>

        </div>
    );
};

export default Posts;