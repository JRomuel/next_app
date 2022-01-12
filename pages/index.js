import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from "mongodb";


function HomePage(props){
  
  return(
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="browse a huge list of highly react meetups"/>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  )

}

// export async function getServerSideProps() {
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     } 
//   };
// }

export async function getStaticProps() {
  // fetch data from API

  const client = await MongoClient.connect('mongodb+srv://jrmendoza:mendozajr@cluster0.m3eb9.mongodb.net/meetups?retryWrites=true&w=majority');

  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      }))
    },
    revalidate: 60,
  };
}

export default HomePage;