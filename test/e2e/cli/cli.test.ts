import { spawn } from 'child_process';
import { time } from 'console';

describe('CLI', () => {
  it('should return the correct output when running the command', (done) => {
    const child = spawn('node', ['./dist/src/entrypoints/cli.js', '-n', '3']);

    let output = '';
    let waitingTimeQueue = 0;

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    setTimeout(() => {
      child.stdin.write('a\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('b\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('c\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('n\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('1\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('2\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('1\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('n\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('1\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('3\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('1\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('y\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('1\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('1\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.write('1\n');
    }, waitingTimeQueue++ * 1000);
    setTimeout(() => {
      child.stdin.end();
    }, waitingTimeQueue++ * 1000);

    child.on('close', () => {
      expect(output).toContain('Player 1 name?');
      expect(output).toContain('Player 2 name?');
      expect(output).toContain('Player 3 name?');
      expect(output).toContain('Select a player');
      expect(output).toContain('Select another player');
      expect(output).toContain('Select a card');
      expect(output).toContain('a guess');
      expect(output).toContain('b guess');
      expect(output).toContain('c guess');
      done();
    });

  }, 35000);
});
