import React, { Fragment, PureComponent } from 'react';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Link,
  Typography,
  withStyles,
  withTheme
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab'
import { compose } from 'recompose';

import { apiRequest } from '../helpers/api';

const styles = (theme) => ({
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    overflowWrap: 'break-word',
    wordBreak: 'break-all'
  },
  tradeVolume24hBtc: {
    [theme.breakpoints.only('xs')]: {
      display: 'none'
    }
  },
  trustScore: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  trustScoreRank: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  yearEstablished: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }
});

class ExchangeList extends PureComponent {
  state = {
    records: [],
    pageSize: 10,
    pageCount: 0,
    currentPage: 0
  }

  componentDidMount() {
    this.fetchData(100);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  fetchData(timeout) {
    this.timer = setTimeout(() => {
      apiRequest({
        url: 'https://api.coingecko.com/api/v3/exchanges',
        method: 'GET',
        data: {
          per_page: 250
        },
        onSuccess: (json) => {
          this.setState({
            records: json,
            pageCount: Math.floor((json.length + this.state.pageSize - 1) / this.state.pageSize),
            currentPage: 0
          });
        },
        onError: (msg) => {
          console.log(msg);
        },
        onFinish: () => {
          this.fetchData(10000); // automatically iterate fetching
        }
      });
    }, timeout);
  }

  onChangePage = (event, page) => {
    this.setState({ currentPage: page - 1 }); // material pagination implements 1-based numbering
  }

  render = () => {
    const records = this.state.records.slice(this.state.currentPage * this.state.pageSize, (this.state.currentPage + 1) * this.state.pageSize);
    return (
      <Grid container>
        <Grid item xl={1} />
        <Grid item xl={10} xs={12}>
          <Box p={1} bgcolor={this.props.theme.palette.background.default}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item lg={2} md={2} sm={4} xs={5}>
                <Typography variant="subtitle1">Exchange</Typography>
              </Grid>
              <Grid item lg={2} md={2} sm={3} xs={5}>
                <Typography variant="subtitle1">Country</Typography>
              </Grid>
              <Grid item lg={3} md={2} sm={3} className={this.props.classes.tradeVolume24hBtc}>
                <Typography variant="subtitle1" align="center">Trade Volume 24h BTC</Typography>
              </Grid>
              <Grid item lg={1} md={2} className={this.props.classes.trustScore}>
                <Typography variant="subtitle1" align="center">Trust Score</Typography>
              </Grid>
              <Grid item lg={1} md={2} className={this.props.classes.trustScoreRank}>
                <Typography variant="subtitle1" align="center">Trust Score Rank</Typography>
              </Grid>
              <Grid item lg={1} className={this.props.classes.yearEstablished}>
                <Typography variant="subtitle1">Year Established</Typography>
              </Grid>
              <Grid item lg={2} md={2} sm={2} xs={2}>
                <Typography variant="subtitle1" align="center">Actions</Typography>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          {records.map((record, index) => (
            <Fragment key={index}>
              <Box p={1}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item lg={2} md={2} sm={4} xs={5}>
                    <Box display="flex" alignItems="center">
                      <Avatar alt="" src={record.image} variant="square" />
                      <Box flex={1} pl={1}>
                        <Typography variant="body1" className={this.props.classes.name}>{record.name}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={2} md={2} sm={3} xs={5}>
                    <Typography variant="body1">{record.country}</Typography>
                  </Grid>
                  <Grid item lg={3} md={2} sm={3} className={this.props.classes.tradeVolume24hBtc}>
                    <Typography variant="body1" align="center">{record.trade_volume_24h_btc}</Typography>
                  </Grid>
                  <Grid item lg={1} md={2} className={this.props.classes.trustScore}>
                    <Typography variant="body1" align="center">{record.trust_score}</Typography>
                  </Grid>
                  <Grid item lg={1} md={2} className={this.props.classes.trustScoreRank}>
                    <Typography variant="body1" align="center">{record.trust_score_rank}</Typography>
                  </Grid>
                  <Grid item lg={1} className={this.props.classes.yearEstablished}>
                    <Typography variant="body1">{record.year_established}</Typography>
                  </Grid>
                  <Grid item lg={2} md={2} sm={2} xs={2}>
                    <Box textAlign="center">
                      <Link href={'/' + record.id}>Detail</Link>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
            </Fragment>
          ))}
          <Grid container justify="flex-end">
            <Box m={1}>
              <Pagination
                count={this.state.pageCount}
                color="primary"
                page={this.state.currentPage + 1} // material pagination implements 1-based numbering
                onChange={this.onChangePage}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item xl={1} />
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles),
  withTheme
)(ExchangeList);