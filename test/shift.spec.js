'use strict';

const ShiftStats = require('../index');

const chai = require('chai');
let expect = chai.expect;

const chaiAsPromised = require('chai-as-promised-compat');
chai.use(chaiAsPromised);

describe('ShiftStats', () => {
  describe('bad api key', () => {
    it('throws an error', () => {
      let s = new ShiftStats('a');
      expect(s.login()).to.be.rejected;
    });
  });

  describe('with valid api key', function() {
    this.timeout(0);

    let s = new ShiftStats();
    before(async() => {
      await s.login();
    });

    context('teamSearch', () => {
      let teamSearch;
      before(async() => {
        teamSearch = await s.teamSearch('hockey', 'bears');
      });

      it('returns some teams', () => {
        expect(teamSearch).to.have.property('teams');
        expect(teamSearch.teams).to.be.an('array');
      });

      it('finds the right team', () => {
        let bears = teamSearch.teams.find(team => team.id === 18827);
        expect(bears).to.have.property('id');
      });
    });

    context('teamSchedule', () => {
      let teamSchedule;
      before(async() => {
        teamSchedule = await s.teamSchedule(18827);
      });

      it('returns a schedule', () => {
        expect(teamSchedule).to.have.property('games');
      });
    });

    context('teamPlayersList', () => {
      let ret;
      before(async() => {
        ret = await s.teamPlayersList(18827);
      });

      it('returns players', () => {
        expect(ret).to.have.property('players');
      });
    });

    context('divisionGamesList', () => {
      let ret;
      before(async() => {
        ret = await s.divisionGamesList(3057);
      });

      it('returns a list of games', () => {
        expect(ret).to.have.property('games');
      });
    });

    context('seasonDivisionsList', () => {
      let ret;
      before(async() => {
        ret = await s.seasonDivisionsList(741);
      });

      it('returns a list of divisions', () => {
        expect(ret).to.have.property('divisions');
      });
    });

    context('seasonSuspensions', () => {
      let ret;
      before(async() => {
        ret = await s.seasonSuspensions(741, false);
      });

      it('returns a list of suspensions', () => {
        expect(ret).to.have.property('suspensions');
      });
    });

    context('leagues', () => {
      let ret;
      before(async() => {
        ret = await s.leagues();
      });

      it('returns a list of leagues', () => {
        expect(ret).to.have.property('leagues');
      });
    });

    context('league', () => {
      let ret;
      before(async() => {
        ret = await s.league(3);
      });

      it('returns a league', () => {
        expect(ret).to.have.property('league');
      });
    });

    context('leagueSeasons', () => {
      let ret;
      before(async() => {
        ret = await s.leagueSeasons(3);
      });

      it('returns a list of seasons', () => {
        expect(ret).to.have.property('seasons');
      });
    });

    context('leagueSeasons', () => {
      let ret;
      before(async() => {
        ret = await s.leagueSuspensions(3, true);
      });

      it('returns a list of suspensions', () => {
        expect(ret).to.have.property('suspensions');
      });
    });

    context('teamsInDivision', () => {
      let ret;
      before(async() => {
        ret = await s.teamsInDivision('XPL', 317, true);
      });

      it('returns a list of teams', () => {
        expect(ret).to.have.property('teams');
      });
    });

    context('teamGames', () => {
      let ret;
      before(async() => {
        ret = await s.teamGames(1, true, true);
      });

      it('returns a list of games', () => {
        expect(ret).to.have.property('games');
      });
    });

    context('teamGamesForStatus', () => {
      let ret;
      before(async() => {
        ret = await s.teamGamesForStatus(1, 'Final,In Progress');
      });

      it('returns a list of games', () => {
        expect(ret).to.have.property('games');
      });
    });

    context('teamPractices', () => {
      let ret;
      before(async() => {
        ret = await s.teamPractices(18827, true, true);
      });

      it('returns a list of practices', () => {
        expect(ret).to.have.property('practices');
      });
    });

    context('teamSuspensions', () => {
      let ret;
      before(async() => {
        ret = await s.teamSuspensions(18827, false);
      });

      it('returns a list of suspensions', () => {
        expect(ret).to.have.property('suspensions');
      });
    });

    context('game', () => {
      let ret;
      before(async() => {
        ret = await s.game(128740);
      });

      it('returns game info', () => {
        expect(ret).to.have.property('game');
      });
    });

    context('gameGoals', () => {
      let ret;
      before(async() => {
        ret = await s.gameGoals(128740, 'away');
      });

      it('returns a list of away goals', () => {
        expect(ret).to.have.property('away_goals');
      });
    });

    context('gameGoalies', () => {
      let ret;
      before(async() => {
        ret = await s.gameGoalies(128740, 'away');
      });

      it('returns a list of away goalies', () => {
        expect(ret).to.have.property('away_goalies');
      });
    });

    context('gamePenalties', () => {
      let ret;
      before(async() => {
        ret = await s.gamePenalties(128740, 'away');
      });

      it('returns a list of away penalties', () => {
        expect(ret).to.have.property('away_penalties');
      });
    });

    context('gameRoster', () => {
      let ret;
      before(async() => {
        ret = await s.gameRoster(128740, 'away');
      });

      it('returns an away roster', () => {
        expect(ret).to.have.property('away_roster');
      });
    });

    context('divisionStandings', () => {
      let ret;
      before(async() => {
        ret = await s.divisionStandings(3057, 'Regular Season');
      });

      it('returns ranked list of teams', () => {
        expect(ret).to.have.property('teams');
      });
    });

    context('divisionTeams', () => {
      let ret;
      before(async() => {
        ret = await s.divisionTeams(3057);
      });

      it('returns a list of teams', () => {
        expect(ret).to.have.property('teams');
      });
    });

    context('divisionLeaders', () => {
      let ret;
      before(async() => {
        ret = await s.divisionLeaders(3057, 'Regular Season', 5, ['points', 'goals', 'assists']);
      });

      it('returns a list of leaders', () => {
        expect(ret).to.have.property('leaders');
      });
    });

    context('divisionSuspensions', () => {
      let ret;
      before(async() => {
        ret = await s.divisionSuspensions(3057, false);
      });

      it('returns a list of suspensions', () => {
        expect(ret).to.have.property('suspensions');
      });
    });
  });
});
